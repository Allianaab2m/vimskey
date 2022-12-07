# vimskey
Misskey client for Vim/Neovim(WIP)

## Install

予め[Deno](https://deno.land), [denops.vim](https://github.com/vim-denops/denops.vim)がインストールされている必要があります。
Denoは最新版をインストールしてください。

Packerの場合

```lua
use({
  'Allianaab2m/vimskey',
  requires = { 'vim-denops/denops.vim' }
})
```

vim-plugの場合
```vim
Plug 'vim-denops/denops.vim'
Plug 'Allianaab2m/vimskey'
```

## Usage

実行時にログインするよう求められます。

インスタンスURIを入力し,起動したブラウザで認証してください。

ログインの状態はVimを閉じるまで保存されます。

`:VimskeyOpenTL <'home' | 'local' | 'hybrid' | 'global'>`

タイムラインを表示します。

`:VimskeyNoteFromCmdline <content> <'public' | 'home'>`

コマンドラインからノートを送信します。

`:VimskeyNotification`

コマンド実行後からの通知を受け取ります。

`notify-send`コマンドが実行できる環境ではデスクトップ通知も行います。

## Todo

- [ ] ノート機能
  - [ ] バッファから
  - [x] Cmdlineから
- [ ] Renote機能
- [ ] 設定保存機能
