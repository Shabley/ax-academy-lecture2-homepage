---
name: doc-to-html
description: |
  문서 파일(DOCX, TXT, MD, PDF) 또는 텍스트를 업로드하면 자동으로 시각적 요소가 강조된
  블로그/웹 게시용 고품질 HTML 웹문서로 변환하는 스킬.
  다크 테마 지원, 데이터 테이블·불릿 박스·타임라인·아코디언 카드·요약 박스 등
  콘텐츠 유형을 자동 감지하여 최적의 시각 레이아웃을 적용한다.

  다음 상황에서 반드시 이 스킬을 사용할 것:
  - DOCX, TXT, MD, PDF 파일을 올리며 "HTML로 변환해줘" 요청 시
  - "웹문서 만들어줘", "웹페이지로 만들어줘", "HTML 문서로 바꿔줘" 요청 시
  - "블로그 포스팅용으로 변환해줘", "시각적으로 예쁘게 만들어줘" 요청 시
  - 텍스트/마크다운을 붙여넣고 "이걸 HTML로 예쁘게 만들어줘" 요청 시
  - 강의자료, 보고서, 책 원고, 뉴스레터 등 문서를 웹용으로 변환 요청 시
  - "티스토리/브런치/네이버 블로그에 올릴 수 있게 만들어줘" 요청 시
  - "다크 테마 HTML로 만들어줘", "라이트/다크 전환 웹문서 만들어줘" 요청 시
  - 파일 첨부 + "이거 HTML" 처럼 변환 의도가 조금이라도 보이면 반드시 이 스킬을 사용할 것
---

# Doc-to-HTML 변환 스킬

문서 파일 또는 텍스트를 고품질 HTML 웹문서로 변환한다.
콘텐츠 유형을 자동 감지하여 최적 시각 컴포넌트를 적용하고,
라이트/다크 테마 전환을 지원하는 완성형 HTML 파일을 납품한다.

---

## Step 0: 파일 읽기

업로드 파일이 있으면 `/mnt/skills/public/file-reading/SKILL.md`를 먼저 읽고
파일 유형에 맞는 방법으로 내용을 추출한다.

| 파일 유형 | 처리 방법 |
|-----------|----------|
| `.md` / `.txt` | `cat` 명령으로 직접 읽기 |
| `.docx` | `/mnt/skills/public/docx/SKILL.md` 참조 후 `python-docx` 추출 |
| `.pdf` | `/mnt/skills/public/pdf-reading/SKILL.md` 참조 후 텍스트 추출 |
| 텍스트 붙여넣기 | 컨텍스트에서 직접 사용 |

---

## Step 1: 콘텐츠 분석 및 컴포넌트 감지

추출한 텍스트를 분석하여 아래 콘텐츠 유형을 자동 감지한다.

| 감지 패턴 | 적용 컴포넌트 |
|-----------|--------------|
| 번호 목록 / 단계별 설명 | 타임라인(Timeline) |
| 표 / 비교 데이터 | 데이터 테이블(Table) |
| `>` 인용 / 핵심 메시지 | 요약 박스(Callout Box) |
| 불릿 목록 3개+ | 카드형 불릿 박스(Bullet Card) |
| Q&A / FAQ / 자주 묻는 질문 | 아코디언(Accordion) |
| 키-값 정의어 목록 | 용어 정의 카드 |
| 코드 블록 | 코드 하이라이트 블록 |
| 이미지 경로 / alt 텍스트 | 이미지 반응형 래퍼 |

---

## Step 2: 테마 결정

사용자가 명시하지 않은 경우 기본값: **라이트 테마 + 다크 토글 버튼 포함**.

| 요청 키워드 | 기본 테마 |
|-------------|----------|
| "다크", "dark", "어두운" | 다크 테마 기본 |
| "라이트", "light", "밝은" | 라이트 테마 기본 |
| 명시 없음 | 라이트 테마 + 토글 버튼 |

---

## Step 3: HTML 생성 규칙

### 3-1. 기본 구조

```html
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[문서 제목]</title>
  <style>/* 모든 CSS 인라인 포함 — 외부 CDN 사용 금지 */</style>
</head>
<body>
  <div class="theme-toggle-btn">🌙</div>
  <article class="doc-container">
    <!-- 변환된 콘텐츠 -->
  </article>
  <script>/* 테마 토글 + 아코디언 JS */</script>
</body>
</html>
```

### 3-2. CSS 변수 (라이트/다크 통합)

```css
:root {
  /* 라이트 테마 기본값 */
  --bg: #f8f9fc;
  --surface: #ffffff;
  --text: #1e293b;
  --text-sub: #64748b;
  --border: #e2e8f0;
  --accent: #1E3A5F;       /* DeepCompass Navy */
  --accent2: #C9A84C;      /* DeepCompass Gold */
  --accent3: #3B82F6;      /* Blue */
  --callout-bg: #eff6ff;
  --callout-border: #3B82F6;
  --tag-bg: #e0f2fe;
  --tag-text: #0369a1;
  --timeline-line: #cbd5e1;
  --code-bg: #f1f5f9;
}
[data-theme="dark"] {
  --bg: #0D1B2E;           /* DeepCompass Dark Navy */
  --surface: #1a2a45;
  --text: #e2e8f0;
  --text-sub: #94a3b8;
  --border: #2d3f5e;
  --accent: #00C8E8;       /* DeepCompass Cyan */
  --accent2: #C9A84C;      /* Gold 유지 */
  --accent3: #60a5fa;
  --callout-bg: #162032;
  --callout-border: #00C8E8;
  --tag-bg: #1e3a5f;
  --tag-text: #7dd3fc;
  --timeline-line: #2d3f5e;
  --code-bg: #0f1f33;
}
```

### 3-3. 필수 컴포넌트 CSS + HTML 패턴

#### 요약 박스 (Callout)
```html
<div class="callout">
  <span class="callout-icon">💡</span>
  <div class="callout-body">핵심 메시지</div>
</div>
```

#### 타임라인
```html
<div class="timeline">
  <div class="tl-item">
    <div class="tl-dot"></div>
    <div class="tl-content"><strong>Step 1</strong><p>내용</p></div>
  </div>
</div>
```

#### 카드형 불릿 박스
```html
<div class="card-grid">
  <div class="card"><div class="card-icon">✅</div><p>항목</p></div>
</div>
```

#### 아코디언 (FAQ)
```html
<div class="accordion">
  <div class="acc-item">
    <button class="acc-header">Q. 질문</button>
    <div class="acc-body"><p>답변</p></div>
  </div>
</div>
```

#### 데이터 테이블
```html
<div class="table-wrap">
  <table class="data-table">
    <thead><tr><th>헤더</th></tr></thead>
    <tbody><tr><td>데이터</td></tr></tbody>
  </table>
</div>
```

#### 코드 블록
```html
<div class="code-block"><pre><code>코드 내용</code></pre></div>
```

---

## Step 4: 블로그 플랫폼별 최적화

사용자가 특정 플랫폼을 언급하면 아래 조정을 적용한다.

| 플랫폼 | 조정 사항 |
|--------|----------|
| **티스토리** | `<article>` 최대 너비 720px, 외부 폰트 제거 |
| **네이버 블로그** | 인라인 스타일 우선, `<div>` 래퍼 구조 단순화 |
| **브런치** | 폰트 크기 18px+, 여백 강조, 이미지 중앙 정렬 |
| **일반 웹** | 기본 레이아웃 유지 (최대 너비 860px) |

플랫폼 명시 없으면 **일반 웹** 기준으로 생성.

---

## Step 5: 파일 저장 및 납품

```bash
# 출력 파일 저장
cp /home/claude/output.html /mnt/user-data/outputs/[원본파일명].html
```

- 파일명: 원본 문서 제목 기반 (공백 → 하이픈, 한글 허용)
- `present_files` 도구로 다운로드 링크 제공
- 완료 후 1-2줄 요약: 감지된 컴포넌트 종류, 테마 설정, 파일명

---

## 출력 품질 체크리스트

변환 완료 전 아래 항목을 내부적으로 확인한다.

- [ ] 외부 CDN·폰트 링크 없음 (완전 자급 HTML)
- [ ] 라이트/다크 토글 버튼 작동
- [ ] 아코디언 클릭 동작 확인
- [ ] 모바일 반응형 (`max-width: 100%`, `flex-wrap`)
- [ ] 원본 내용 누락 없음
- [ ] DeepCompass 브랜드 컬러 변수 적용

---

## 오류 처리

| 상황 | 대응 |
|------|------|
| 파일 읽기 실패 | 사용자에게 파일 형식 확인 요청 |
| 내용이 너무 짧음 (200자 미만) | 그대로 변환 후 "내용이 짧아 기본 레이아웃 적용" 안내 |
| 감지된 컴포넌트 없음 | 기본 article + 단락 구조로 변환 |
| PDF 텍스트 추출 불가 (이미지 PDF) | "텍스트 추출 불가, 내용을 직접 붙여넣기 요청" 안내 |
