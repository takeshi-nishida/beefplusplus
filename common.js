const optionNames = {
    "format_periods" : true,
    "hide_tableheaders": true,
    "hide_filenames": true,
    "sort_notifications": true,
    "set_default_datetimes": true,
    "use_coursetime_buttons": true,
    "notify_by_default": true,
    "insert_clickcomplete_message": true,
    "mailto": true,
    "title_tab": true,
    "count_forum_messages": true,
    "show_submission_text_length": true,
    "adjacent_feedback_button": true,
    "add_strong_warning": true,
    "promote_default_actions": true
};

// 残り時間[秒]を計算する
function remainingTime(date){
    return Math.floor((date - new Date()) / 1000);
}

// 時間をテキストに変換する（1時間以上の場合は分まで、1時間未満の場合は秒まで）
function timeInText(seconds){
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);

    if(seconds >= 86400){ // 1日以上
        return days + "日" + Math.floor((seconds % 86400) / 3600) + "時間";
    } else if(seconds >= 3600){ // 1時間以上
        return hours + "時間" + Math.floor((seconds % 3600) / 60) + "分";
    } else {
        return Math.floor(seconds / 60) + "分" + (seconds % 60) + "秒";
    }
}