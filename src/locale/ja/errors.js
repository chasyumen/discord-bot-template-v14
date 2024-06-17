export const id = "errors";
export const language = "ja";

export const data = {
    "errors": {
        "permissions": {
            "bot": {
                "missingEmbed": "埋め込みリンクの権限が付与されていないため処理を正常に完了できませんでした。",
                "any": "権限不足です。下記の権限が付与されているかご確認ください。\n```\n!{permissions}\n```",
                "any_channel": "権限不足です。下記の権限がチャンネルに付与されているかご確認ください。\n```!{permissions}```\n\nまた、これらの権限はサーバーの権限として有効になっていますがチャンネル権限で無効にするよう上書きされている可能性があります。\n```!{permissions2}```",
                "any_channel2": "権限不足です。下記の権限がチャンネルに付与されているかご確認ください。\n```!{permissions}```"
            },
            "user": {
                "any": "権限不足です、あなたが以下の権限を保有しているか確認してください。\n```!{permissions}```",
                "manageGuild": "このコマンドへアクセスするにはサーバー管理権限を保有している必要があります。",
                "internalPermission": "このコマンドへのアクセスが拒否されました。"
            }
        },
        "title": "エラー",
        "unknown": "原因不明のエラーが発生しました。"
    },
};