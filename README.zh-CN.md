<p align="center">
  <img src="./images/logo.svg" width="120" alt="阳谋求解器" />
</p>

<h1 align="center">阳谋求解器 · Yangmou Solver</h1>

<p align="center">
  <b>把「明牌博弈」方法论变成可复用的求解引擎——检索 + LLM 多层语义分析，覆盖销售 / 营销 / 管理 / 职场 / 投资 / 产品 / 谈判七领域。让对手看穿了也不得不按你的剧本走。</b>
</p>

<p align="center">
  🇬🇧 <a href="./README.en.md">English version</a> &nbsp;|&nbsp;
  🇨🇳 <a href="./README.md">双语版（中英）</a>
</p>

<p align="center">
  <img alt="Cross-tool" src="https://img.shields.io/badge/cross--tool-compatible-00b4d8" />
  <img alt="Agent Skills" src="https://img.shields.io/badge/format-Agent%20Skills-8b5cf6" />
  <img alt="Domains" src="https://img.shields.io/badge/domains-7%20fields-8b5cf6" />
  <img alt="Cases" src="https://img.shields.io/badge/cases-88-10b981" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen" />
</p>

---

## 简介

> **夫阳谋者，明牌之弈也。势虽暴露于敌前，而敌不能避者，非其愚也，乃为规则、人性、大势所制，两害相权取其轻，不得不循我之局而行。昔孙子言「不战而屈人之兵」，鬼谷子论「捭阖」，皆阳谋之祖。今商业与人际之争，客户压价、竞品环伺、同侪相轧，局局皆需明牌之智。本技能萃古之阳谋十书、八十有八例于一案，辅以检索与多层语义推演，使求谋者得破局之明牌，而不假阴谋诡道。**

简言之：**阳谋求解器**是一套**跨 AI 开发工具通用的求解工作流**（原生支持 WorkBuddy / Codex / OpenCode，也可作为项目规则或对话上下文接入 Cursor / Claude Code / Codex CLI / Gemini CLI / Qwen Code / Trae 等）。它不是「给几条建议」的工具，而是一套**人机协作的求解工作流**：先通过多轮询问锁定你真实的博弈局面，再检索古今天下的阳谋案例，做六层语义分析（含现代领域翻译），最终交给你一个**对方明知是坑、也不得不跳的明牌方案**。

它把三件事一次性解决：**读懂你的局 → 匹配可迁移的阳谋原型 → 翻译成你所在领域的落地打法**。

## 亮点

> **古案提供可迁移的「锁死机制」，大模型在案例底座上做深度推理——两者结合，既准又落地。** —— 本技能的核心设计

- **真实案例底座（88 条）**：73 条原典（含《孙子兵法》《鬼谷子》《三十六计》《反经》《资治通鉴》《君主论》《战争论》《厚黑学》《血酬定律》《潜规则》十书）带**真实原文引文 + 出处 URL**；15 条历史 / 商业现代案例（特斯拉、Costco、网飞、华为、丁元英格律诗局等）同样可溯源。
- **多轮询问锁定场景**：四轮对话（场景定位 → 对手画像 → 我的筹码 → 约束红线），不拍脑袋，把模糊的「我想赢」逼成精确的「局的描述」。
- **六层语义分析**：解构 → 识别锁死机制（规则 / 人性 / 大势三支柱）→ 匹配原型 → **现代领域翻译** → 设计明牌与造势 → 反制推演与防御。
- **七领域并重，不偏科**：销售 / 营销 / 管理 / 职场 / 投资 / 产品 / 谈判，每条案例均带完整七领域打法，由你在首轮确认所在领域。
- **轻量语义检索**：`scripts/retrieve.py` 秒级定位最贴合的阳谋原型，支持按支柱 / 领域 / 书名过滤。
- **边界明确不教骗术**：阳谋靠真「势」，不造假、不埋隐性条款、不制造互害——靠阴谋破局会反噬复购与声誉。

## 支持的 AI 工具（跨工具通用）

本技能的核心文件（`SKILL.md` / `references/*.md` / `references/cases.json` / `scripts/retrieve.py`）均为纯 Markdown / JSON / Python，**不与任何单一客户端绑定**。按你使用的工具，提供三种接入方式：

| 接入方式 | 适用工具 | 用法 |
|---|---|---|
| **① 原生技能**（直接安装） | WorkBuddy、Codex、OpenCode | 把 `yangmou/` 目录放到对应客户端的 skills 目录，对话框用自然语言触发 |
| **② 项目规则 / 记忆文件**（降级兼容） | Claude Code（`CLAUDE.md` 或 `.claude/skills/`）、Cursor（`.cursor/rules/*.mdc`）、Codex CLI / Gemini CLI / Qwen Code（`AGENTS.md` / `GEMINI.md`）、Windsurf（`.windsurf/rules/`）、Cline（`.clinerules`）、GitHub Copilot（`.github/copilot-instructions.md`）、Trae / 通义灵码（项目规则） | 将 `SKILL.md` 全文（或要点）放入上述项目指令文件，工具即按工作流响应 |
| **③ 对话上下文**（零配置） | ChatGPT Web、任意网页 / App 聊天 | 直接把 `SKILL.md` 内容贴进对话，描述你的局，即按流程获得阳谋方案 |

> 本技能属于「推理 / 知识」型工作流，不会自动改写你的代码；因此即使工具不支持原生技能，用方式 ② / ③ 也几乎无损。若想本地跑检索加速，可在任意工具的终端执行 `python scripts/retrieve.py "..."`。

## 上手

### 前提

```bash
# 1. 任选一个支持的 AI 开发工具（见上「支持的 AI 工具」一节；零依赖，无需特定客户端）
# 2. 建议在「高推理模型」下使用，以获得最佳六层分析质量
#    （Claude Opus 4.6 / DeepSeek v4 Pro / GPT-5.6 同等级别）

# 3. （可选）本地运行检索脚本需要 Python 3
python --version   # 建议 3.10+
```

### 安装技能

**方式 A · 原生技能（WorkBuddy / Codex / OpenCode）**
```bash
git clone https://github.com/whishi47/yangmou-skill.git \
  "$HOME/.workbuddy/skills/yangmou"     # WorkBuddy
# Codex:    $HOME/.codex/skills/yangmou
# OpenCode: $HOME/.config/opencode/skills/yangmou
```

**方式 B · 作为项目规则 / 记忆文件（Claude Code / Cursor / Codex CLI / Gemini CLI / Qwen Code / Windsurf / Cline / Copilot / Trae 等）**
```bash
git clone https://github.com/whishi47/yangmou-skill.git
# 把 SKILL.md 复制到你的项目指令文件，例如：
cp yangmou/SKILL.md ./CLAUDE.md        # Claude Code（项目级）
# Cursor  → .cursor/rules/yangmou.mdc
# Codex CLI / Gemini CLI / Qwen Code → AGENTS.md / GEMINI.md
# Windsurf → .windsurf/rules/yangmou.md
# Cline    → .clinerules
# Copilot  → .github/copilot-instructions.md
# Trae / 通义灵码 → 在 IDE「项目规则」中粘贴 SKILL.md
```

**方式 C · 直接贴进对话（ChatGPT Web / 任意聊天）**
复制 `SKILL.md` 全文 → 粘贴到对话框 → 描述你的博弈困境，即按流程给方案。

> `$HOME` 在 Windows 上通常是 `C:\Users\你的用户名`。各客户端技能目录可能不同（`.workbuddy` / `.codex` / `.config/opencode`），以你使用的客户端为准。安装后无需编译、无需依赖。

### 使用

| 触发方式 | 操作 | 效果 |
|---|---|---|
| 💬 自然语言 | "客户一直压价，怎么谈" | 启动技能，进入四轮询问 |
| 💬 自然语言 | "怎么锁客复购" | 直接进入领域确认 + 检索 |
| 💬 自然语言 | "讲讲阳谋是什么" | 读「阳谋原理」讲解，不走完整流程 |
| 💬 自然语言 | "给我一个搞定难缠客户的阳谋" | 四轮询问 → 六层分析 → 明牌方案 |
| 📎 场景描述 | 贴一大段博弈困境 | 直接凝练成「局的描述」并检索 |

首次触发时，技能会**逐轮**问你四类问题（每轮只问同类的 2~4 个，答完再进下一轮）：**场景定位**、**对手画像**、**我的筹码**、**约束红线**。若你首轮已给足信息，会合并轮次，但至少确认过「对手诉求 / 恐惧」与「我的筹码 / 规则权」两项。

## 工作原理

```
┌──────────────────────────────────────────────────────────┐
│                yangmou 阳谋求解器                          │
│   输入：你的博弈困境（自然语言 / 场景描述）                │
└───────────────────────────┬──────────────────────────────┘
                            ▼
   ┌──────────────────────────────────────────────┐
   │ ① 四轮询问（对话）                            │
   │   场景定位 → 对手画像 → 我的筹码 → 约束红线   │
   │   → 凝练成 80~150 字「局的描述」             │
   └──────────────────────┬───────────────────────┘
                           ▼
   ┌──────────────────────────────────────────────┐
   │ ② 检索案例底座                                │
   │   scripts/retrieve.py "局的描述" --top 3       │
   │   （可选 --pillar 规则|人性|大势              │
   │          --field 七领域 --book 书名）          │
   │   → 1~3 个最贴合原型                          │
   └──────────────────────┬───────────────────────┘
                           ▼
   ┌──────────────────────────────────────────────┐
   │ ③ 六层语义分析                                │
   │   解构 → 锁死机制(三支柱) → 匹配原型          │
   │   → 现代领域翻译 → 明牌设计+造势              │
   │   → 反制推演与防御                            │
   │   → 本周可做的 3 件事                         │
   └──────────────────────────────────────────────┘
```

**第 ① 步 四轮询问**：通过对话把模糊的诉求逼成精确的「局的描述」，包含我方角色、决策人 / 对手、各自诉求与恐惧、我的筹码、规则谁定、时间窗与底线。

**第 ② 步 检索**：把「局的描述」喂给 `retrieve.py`，脚本定位 `references/cases.json` 并秒级返回 1~3 个原型；可叠加 `--pillar / --field / --book` 收窄范围。

**第 ③ 步 六层分析**：选 1~2 个最贴合的原型，点明其「锁死机制」（靠规则 / 人性 / 大势哪根绳把对方绑住），用 `现代领域迁移.md` 的对照表翻译成目标领域的现代打法，设计要公开的「明牌」动作与要构建的「势」，并预判对方反制逐条给防御。

## 案例库

`references/cases.json` 共 **88 条**结构化案例：

- **73 条原典**（十书）：孙子兵法(8)、鬼谷子(8)、三十六计(10)、反经(8)、资治通鉴(7)、君主论(8)、战争论(8)、厚黑学(8)、血酬定律(4)、潜规则(4)。每条含 `source_text` 真实原文引文 + `source_url` 出处 + `lock_mechanism` 锁死机制 + `transfer_models` 通用思维模型 + `fields` 七领域打法。
- **15 条历史 / 商业现代案例**：围魏救赵式管理、特斯拉开放专利、Costco 会员制、网飞规则重构、华为公开鸿蒙架构、丁元英格律诗局等，均带可溯源出处。

可溯源索引见 `references/原典阳谋.md`（73 条原典的引文 + 出处 + 七领域打法速览）。

## 内置脚本

### `scripts/retrieve.py`

零依赖的轻量语义检索脚本（bigram 匹配），不调用大模型，速度快、确定性强。自动定位 `references/cases.json`。

```bash
# 基础用法：返回最贴合的 3 个原型
python scripts/retrieve.py "客户强势压价 谈判" --top 3

# 限定支柱（规则 / 人性 / 大势）
python scripts/retrieve.py "如何锁客 会员" --pillar 规则 --top 5

# 限定目标领域（销售/营销/管理/职场/投资/产品/谈判）
python scripts/retrieve.py "营销 裂变 渠道" --field 营销 --top 3

# 限定某本原典
python scripts/retrieve.py "不战而屈人之兵" --book 孙子兵法 --top 3
```

参数说明：

| 参数 | 说明 |
|------|------|
| 位置参数 | 场景描述（自然语言，越具体命中越准） |
| `--top N` | 返回前 N 个原型（默认 3） |
| `--pillar` | 限定三支柱之一：`规则` / `人性` / `大势` |
| `--field` | 限定领域：`销售` / `营销` / `管理` / `职场` / `投资` / `产品` / `谈判` |
| `--book` | 限定原典书名（按子串过滤，如 `孙子兵法` / `鬼谷子` / `三十六计` / `反经`） |

## 目录结构

```
yangmou/
├── SKILL.md                          # 技能主文件（工作流定义）
├── README.md                         # 双语版（中英）
├── README.en.md                      # 英文版
├── README.zh-CN.md                   # 本文档（中文版）
├── images/
│   └── logo.svg                      # 文档用 logo
├── LICENSE                           # MIT 协议
├── references/
│   ├── cases.json                    # 结构化案例库（检索底座，88 条）
│   ├── 原典阳谋.md                    # 已灌原典的可溯源索引（73 条）
│   ├── 书籍索引.md                    # 可继续灌入的书目与拆解规范
│   ├── 阳谋原理.md                    # 原理、三支柱、与阴谋区别、边界
│   ├── 阳谋多场景.md                  # 多情境映射、四轮提问库、六层分析、输出模板
│   └── 现代领域迁移.md                # 三支柱现代翻译、心理学/定价对照表、迁移工作表
└── scripts/
    └── retrieve.py                   # 轻量语义检索脚本
```

## 边界与禁忌

- **不教骗术**：不造假数据、不埋隐性条款、不误导客户——那是阴谋，破坏复购与声誉。阳谋靠真「势」。
- **不制造互害**：二桃杀三士、金刀计这类「内耗 / 猜疑」原型，只用于激发健康紧迫感或离间竞品，绝不用于搞垮客户自己的团队。
- **底气优先**：若发现你的产品 / 价值站不住，先建议补内功，再谈亮明牌，否则会反噬。
- **有据才用猜疑链**：依赖「触发猜疑」的原型，必须有真实依据，否则反噬声誉。

## 协议

MIT © 2026
