"""
격주 업데이트 제안 에이전트
코드베이스를 분석해서 개선 제안을 GitHub Issue로 생성합니다.
"""
import json
import os
import subprocess
import urllib.request
import urllib.error
from datetime import datetime


def read_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception:
        return ''


def build_codebase_summary():
    files = {
        'index.html': read_file('index.html'),
        'src/api/claude.js': read_file('src/api/claude.js'),
        'src/components/question-card.js': read_file('src/components/question-card.js'),
        'src/components/history.js': read_file('src/components/history.js'),
        'src/components/graveyard.js': read_file('src/components/graveyard.js'),
        'src/components/toast.js': read_file('src/components/toast.js'),
        'src/styles/tokens.css': read_file('src/styles/tokens.css'),
    }
    return '\n\n'.join([f'=== {k} ===\n{v}' for k, v in files.items() if v])


def call_claude(api_key, codebase):
    prompt = f"""다음은 "철학적 질문 자판기" 웹 앱(PWA)의 현재 코드베이스입니다.

{codebase}

이 앱의 컨셉과 현재 구현 상태를 분석하고, 개선하면 좋을 사항 3~5가지를 제안해주세요.
기능 추가, UX 개선, 기술적 개선 등 다양한 관점에서 봐주세요.
실제로 구현 가능하고 이 앱의 감성/컨셉에 맞는 제안이어야 합니다.

아래 형식을 정확히 따라주세요:

### 앱 현황 요약
(현재 구현된 핵심 기능을 2~3줄로)

### 제안 사항

#### 1. [제안 제목]
**왜 필요한가**: ...
**어떻게 구현**: ...
**난이도**: 쉬움 / 보통 / 어려움

(3~5개 반복)

### 이번 스프린트 추천 1순위
**제안**: ...
**이유**: ..."""

    body = json.dumps({
        'model': 'claude-sonnet-4-20250514',
        'max_tokens': 2000,
        'messages': [{'role': 'user', 'content': prompt}]
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.anthropic.com/v1/messages',
        data=body,
        headers={
            'Content-Type': 'application/json',
            'x-api-key': api_key,
            'anthropic-version': '2023-06-01',
        }
    )

    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))

    return data['content'][0]['text']


def ensure_label():
    """enhancement 라벨이 없으면 생성"""
    result = subprocess.run(
        ['gh', 'label', 'list', '--json', 'name'],
        capture_output=True, text=True
    )
    labels = [l['name'] for l in json.loads(result.stdout or '[]')]
    if 'enhancement' not in labels:
        subprocess.run([
            'gh', 'label', 'create', 'enhancement',
            '--color', '7a9e7e', '--description', '개선 제안'
        ])


def create_issue(title, body):
    ensure_label()
    subprocess.run([
        'gh', 'issue', 'create',
        '--title', title,
        '--body', body,
        '--label', 'enhancement',
    ], check=True)


def main():
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        raise RuntimeError('ANTHROPIC_API_KEY 환경변수가 없습니다.')

    print('코드베이스 읽는 중...')
    codebase = build_codebase_summary()

    print('Claude API 호출 중...')
    suggestions = call_claude(api_key, codebase)

    date_str = datetime.now().strftime('%Y-%m-%d')
    title = f'🌿 격주 업데이트 제안 — {date_str}'

    issue_body = f"""> 이 이슈는 격주 업데이트 제안 에이전트가 자동 생성했습니다.

{suggestions}
"""

    print('GitHub Issue 생성 중...')
    create_issue(title, issue_body)
    print(f'완료: {title}')


if __name__ == '__main__':
    main()
