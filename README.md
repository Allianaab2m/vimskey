# vimskey

Misskey client for Vim/Neovim(WIP)

## Install

予め[Deno](https://deno.land),
[denops.vim](https://github.com/vim-denops/denops.vim)がインストールされている必要があります。
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

インスタンスURLを入力し,起動したブラウザで認証してください。

ログインの状態は`/home/user/.local/share/vimskey/credential.json`に保存されます。

`:VimskeyOpenTL <'home' | 'local' | 'hybrid' | 'global'>`

タイムラインを表示します。

`:VimskeyAuth`

MiAuthを通じて認証します。

`:VimskeyNote`

コマンドラインからノートを送信します。

`:VimskeyRenote`

TL表示時にカーソル上のノートをリノートします。

## Thanks!

- [denops.vim](https://github.com/vim-denops/denops.vim)
- [misskey.js](https://github.com/misskey-dev/misskey.js)
- [MiAuth.js](https://github.com/Comamoca/miauth.js)
- [denops-misskey](https://github.com/ansanloms/denops-misskey)
