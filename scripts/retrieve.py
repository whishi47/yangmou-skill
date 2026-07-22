#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
retrieve.py - 阳谋案例库轻量语义检索

对 references/cases.json 做"字符 bigram 重叠 + 标签/领域加权"的轻量语义检索，
输入一段场景描述（最好是四轮询问后合成的"局"），返回最相关的阳谋原型。

用法:
    python retrieve.py "客户强势压价 谈判" --top 3
    python retrieve.py "如何锁客 会员" --pillar 规则 --top 5
    python retrieve.py "营销 裂变 渠道" --field 营销 --top 3
    python retrieve.py "不战而屈人之兵" --book 孙子兵法 --top 3

零依赖，仅用 Python 标准库。脚本随 skill 分发，可被直接执行，也可被读取后微调。

可选领域 --field: 销售 / 营销 / 管理 / 职场 / 投资 / 产品 / 谈判
可选书名 --book: 孙子兵法 / 鬼谷子 / 三十六计 / 反经 / …（按书名子串过滤）
"""

import json
import os
import re
import sys

PUNCT = re.compile(r"[\s，。、；：？！“”‘’（）()\[\]{}<>/\\|@#$%^&*_\-+=~`.,:;?!'\" ]+")

VALID_FIELDS = ["销售", "营销", "管理", "职场", "投资", "产品", "谈判"]


def bigrams(text):
    """生成字符级 bigram 集合（对中文友好，对英文按词留底）。"""
    text = PUNCT.sub("", text)
    grams = set()
    # 中文/混合：滑动窗口 2-gram
    for i in range(len(text) - 1):
        g = text[i:i + 2]
        if g.isascii() and " " not in g:
            grams.add(g.lower())
        else:
            grams.add(g)
    # 英文单词作为整体 token
    for w in re.findall(r"[a-zA-Z]{2,}", text.lower()):
        grams.add("word:" + w)
    return grams


def load_cases():
    here = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(here, "..", "references", "cases.json")
    path = os.path.normpath(path)
    if not os.path.exists(path):
        # 兜底：从 cwd 找
        path = os.path.join(os.getcwd(), "references", "cases.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("cases", [])


def _to_text(v):
    """把字段值统一成字符串：列表用空格拼，其余直接转 str。"""
    if isinstance(v, list):
        return " ".join(str(x) for x in v)
    if v is None:
        return ""
    return str(v)


def case_blob(case):
    """构造检索语料块：名称/摘要/背景/锁死/销售迁移/通用思维模型/多领域打法/标签，
    并纳入原典字段（原文 source_text、书名 book、篇名 chapter），使'不战而屈人之兵''捭阖'等
    原文关键词也能被直接命中。兼容 transfer_models 等字段可能为字符串或列表。"""
    parts = [
        _to_text(case.get("name", "")),
        _to_text(case.get("summary", "")),
        _to_text(case.get("background", "")),
        _to_text(case.get("lock_mechanism", "")),
        _to_text(case.get("sales_transfer", "")),
        _to_text(case.get("transfer_models", "")),
    ]
    # 原典字段：原文 + 书名 + 篇名（让"原典级"查询可命中）
    parts.append(_to_text(case.get("source_text", "")))
    parts.append(_to_text(case.get("book", "")))
    parts.append(_to_text(case.get("chapter", "")))
    # 多领域打法（fields 值）一并纳入，使跨领域查询也能命中
    fields = case.get("fields", {})
    if isinstance(fields, dict):
        parts.extend(_to_text(v) for v in fields.values())
    parts.append(_to_text(case.get("tags", [])))
    return " ".join(parts)


def score_case(query_grams, case, field=None):
    blob = case_blob(case)
    case_grams = bigrams(blob)
    overlap = query_grams & case_grams
    if not overlap:
        return 0.0, 0

    # 基础分 = 重叠 bigram 数
    base = float(len(overlap))

    # 标签加权：命中标签视为强信号
    tag_bonus = 0.0
    tags = [t.lower() for t in case.get("tags", [])]
    for g in overlap:
        for t in tags:
            if g in t or ("word:" + t) == g:
                tag_bonus += 1.5
                break

    # 领域加权：命中所求领域（fields 键或标签）额外加分
    field_bonus = 0.0
    if field:
        fields = case.get("fields", {})
        has_field = (isinstance(fields, dict) and field in fields) or (field in tags)
        if has_field:
            field_bonus += 3.0
            # 该领域打法文字与查询重叠，再加权（让"营销裂变"更贴近营销字段）
            ftext = fields.get(field, "") if isinstance(fields, dict) else ""
            if ftext:
                fgrams = bigrams(ftext)
                if query_grams & fgrams:
                    field_bonus += 2.0

    return base + tag_bonus + field_bonus, len(overlap)


def main():
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print("用法: python retrieve.py \"场景描述\" [--top N] [--pillar 规则|人性|大势] [--field 销售|营销|管理|职场|投资|产品|谈判] [--book 书名]")
        print("示例: python retrieve.py \"客户强势压价 谈判\" --top 3")
        print("示例: python retrieve.py \"营销 裂变 渠道\" --field 营销 --top 3")
        print("示例: python retrieve.py \"不战而屈人之兵\" --book 孙子兵法 --top 3")
        return

    top = 3
    pillar = None
    field = None
    book = None
    query_parts = []
    i = 0
    while i < len(args):
        a = args[i]
        if a == "--top" and i + 1 < len(args):
            try:
                top = int(args[i + 1])
            except ValueError:
                pass
            i += 2
            continue
        if a == "--pillar" and i + 1 < len(args):
            pillar = args[i + 1]
            i += 2
            continue
        if a == "--field" and i + 1 < len(args):
            field = args[i + 1]
            if field not in VALID_FIELDS:
                print("[警告] 未知领域 '%s'，应从 %s 中选择。忽略 --field。" % (field, "/".join(VALID_FIELDS)))
                field = None
            i += 2
            continue
        if a == "--book" and i + 1 < len(args):
            book = args[i + 1]
            i += 2
            continue
        query_parts.append(a)
        i += 1

    query = " ".join(query_parts).strip()
    if not query:
        print("未提供查询内容。")
        return

    cases = load_cases()
    query_grams = bigrams(query)

    scored = []
    for c in cases:
        if pillar and pillar not in c.get("pillars", []):
            continue
        if field:
            fields = c.get("fields", {})
            tags = c.get("tags", [])
            has_field = (isinstance(fields, dict) and field in fields) or (field in tags)
            if not has_field:
                continue
        if book:
            cb = c.get("book", "")
            if book not in cb:
                continue
        s, n = score_case(query_grams, c, field=field)
        if s > 0:
            scored.append((s, n, c))

    scored.sort(key=lambda x: x[0], reverse=True)
    scored = scored[:top]

    if not scored:
        print("[检索结果] 未命中相关阳谋原型。建议放宽描述，或补充 cases.json 案例。")
        return

    print("=" * 56)
    print("阳谋案例检索结果（按相关度排序）")
    print("查询: %s" % query)
    if field:
        print("领域过滤: %s" % field)
    if book:
        print("书名过滤: %s" % book)
    print("=" * 56)
    for rank, (s, n, c) in enumerate(scored, 1):
        print("\n【%d】%s  (支柱: %s | 相关度 %.1f)" % (rank, c.get("name"), "/".join(c.get("pillars", [])), s))
        print("  类型: %s | 时代: %s | 出处: %s·%s" % (c.get("type"), c.get("era"), c.get("book", "-"), c.get("chapter", "-")))
        print("  概要: %s" % c.get("summary"))
        print("  锁死机制: %s" % c.get("lock_mechanism"))
        print("  通用思维模型: %s" % _to_text(c.get("transfer_models", "")))
        if field:
            fields = c.get("fields", {})
            fplay = fields.get(field, "") if isinstance(fields, dict) else ""
            if fplay:
                print("  【%s】打法: %s" % (field, fplay))
        else:
            # 优先展示与查询最相关的领域打法；原典展示原文片段
            fplay = pick_field_play(c, query)
            if fplay:
                print("  【%s】打法: %s" % fplay)
            if c.get("type") == "原典" and c.get("source_text"):
                snippet = c["source_text"]
                if len(snippet) > 60:
                    snippet = snippet[:60] + "…"
                print("  原典引文: %s" % snippet)
            elif c.get("sales_transfer"):
                print("  销售迁移: %s" % c.get("sales_transfer"))
        print("  标签: %s" % "、".join(c.get("tags", [])))
    print("\n" + "=" * 56)
    print("提示: 选 1~2 个最贴合的原型，进入六层语义分析（含现代领域翻译，见 SKILL.md / 阳谋多场景.md / 现代领域迁移.md）。")


def pick_field_play(case, query):
    """在未指定 --field 时，挑选与查询最相关的领域打法展示。"""
    fields = case.get("fields", {})
    if not isinstance(fields, dict):
        return None
    q = query
    # 领域关键词映射
    kw_map = {
        "销售": ["销售", "客户", "成交", "报价", "压价", "签单"],
        "营销": ["营销", "品牌", "流量", "增长", "裂变", "渠道", "曝光"],
        "管理": ["管理", "团队", "部门", "组织", "协作", "绩效"],
        "职场": ["职场", "领导", "同事", "老板", "晋升", "甩锅", "背锅"],
        "投资": ["投资", "股票", "资产", "仓位", "估值", "止损"],
        "产品": ["产品", "功能", "用户", "体验", "需求", "迭代"],
        "谈判": ["谈判", "议价", "条款", "让步", "筹码", "博弈"],
    }
    best, bestscore = None, 0
    for fld, kws in kw_map.items():
        if fld not in fields:
            continue
        score = sum(1 for k in kws if k in q)
        if score > bestscore:
            bestscore, best = score, fld
    if best:
        return (best, fields[best])
    # 无关键词命中时，回退展示第一个有内容的领域
    for fld in ["销售", "谈判", "职场", "管理", "营销", "投资", "产品"]:
        if fields.get(fld):
            return (fld, fields[fld])
    return None


if __name__ == "__main__":
    main()
