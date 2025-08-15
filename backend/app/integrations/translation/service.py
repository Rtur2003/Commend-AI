# backend/app/services/translation_service.py
"""
Multi-language error/success message service
"""

MESSAGES = {
    'en': {
        # Validation Errors
        'no_data_sent': "📡 No data sent!\n\nNo data reached the server.\n\n💡 Check your internet connection and try again.",
        'missing_video_url': "📝 Missing information!\n\nYouTube video URL is required.\n\n💡 Please enter a valid YouTube video link.",
        'missing_language': "🌐 Language selection required!\n\nPlease select a comment language.\n\n💡 Choose from Turkish, English or other available languages.",
        'missing_comment_style': "🎨 Comment style required!\n\nPlease specify a comment style.\n\n💡 Missing information in form.",
        'form_validation_error': "📋 Form data invalid!\n\nSent data is not valid.\n\nTechnical detail: {error}\n\n💡 Refresh the page and try again.",
        'missing_comment_data': "📝 Missing information! Video URL and comment text required.",
        'invalid_youtube_url': "🔗 Invalid YouTube URL!\n\nPlease enter a valid YouTube video link. Example formats:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n\n💡 Make sure you select the complete link when copying.",
        
        # Video Errors
        'video_details_failed': "📹 Could not get video information!",
        'video_not_found': "Video not found. This could be due to:\n• Video deleted or private\n• URL entered incorrectly\n• Video has access restrictions\n\n💡 Check URL and try a valid, public video.",
        'video_private': "This video is private or has restricted access.\n\n💡 Try a public YouTube video.",
        'video_generic_error': "Technical detail: {error}\n\n💡 Try a different video or try again later.",
        
        # Duplicate Warnings
        'duplicate_warning': "⚠️ You have already commented on this video!\n\nA total of {count} comments have been posted to this video. For system security, multiple comments to the same video are not allowed.\n\n✅ You can create new comment\n❌ But cannot send to this video",
        'duplicate_error': "🚫 Comment could not be sent!\n\nA total of {count} comments have been posted to this video before. Due to system security and spam prevention policy, multiple comments to the same video are not allowed.\n\n💡 Try another video or choose a video you haven't commented on before.",
        
        # AI Generation Errors
        'ai_generation_failed': "🤖 Error occurred while generating comment!",
        'ai_api_key_error': "🔑 Problem with AI service connection.\n\n💡 Contact system administrator or try again later.",
        'ai_quota_error': "⏰ AI service limit exceeded.\n\n💡 Wait a few minutes and try again.",
        'ai_network_error': "🌐 Internet connection problem.\n\n💡 Check your connection and try again.",
        'ai_generic_error': "Technical detail: {error}\n\n💡 Refresh page and try again.",
        
        # YouTube API Errors  
        'youtube_post_failed': "🚫 Error occurred while posting comment!",
        'youtube_permission_error': "📝 You don't have permission to post comments. This could be due to:\n• Your YouTube account has comment restrictions\n• Video owner has disabled comments\n• Your account is not yet verified\n\n💡 Check your YouTube account and try again later.",
        'youtube_quota_error': "⏰ API limit exceeded. System temporarily busy.\n\n💡 Try again after a few minutes.",
        'youtube_not_found_error': "📹 Video not found or inaccessible.\n\n💡 Check video link and make sure it's a valid, accessible video.",
        'youtube_generic_error': "Technical detail: {error}\n\n💡 If problem persists, try a different video or try again later.",
        
        # Success Messages
        'comment_posted_success': "✅ Comment successfully posted!",
        'comment_generated_success': "✅ Comment generated successfully! You can send it to YouTube.",
        
        # System Errors
        'system_error': "🔧 Unexpected system error!\n\nTechnical detail: {error}\n\n💡 Refresh page and try again. If problem persists, contact system administrator.",
    },
    
    'tr': {
        # Validation Errors
        'no_data_sent': "📡 Veri gönderilmedi!\n\nSunucuya hiç veri ulaşmadı.\n\n💡 İnternet bağlantınızı kontrol edin ve tekrar deneyin.",
        'missing_video_url': "📝 Eksik bilgi!\n\nYouTube video URL'si gerekli.\n\n💡 Lütfen geçerli bir YouTube video linki girin.",
        'missing_language': "🌐 Dil seçimi gerekli!\n\nLütfen yorum dilini seçin.\n\n💡 Türkçe, İngilizce veya diğer mevcut dillerden birini seçin.",
        'missing_comment_style': "🎨 Yorum stili gerekli!\n\nLütfen bir yorum stili belirtin.\n\n💡 Forma eksik bilgi gönderildi.",
        'form_validation_error': "📋 Form bilgileri hatalı!\n\nGönderilen veriler geçerli değil.\n\nTeknik detay: {error}\n\n💡 Sayfayı yenileyip tekrar deneyin.",
        'missing_comment_data': "📝 Eksik bilgi! Video URL'si ve yorum metni gerekli.",
        'invalid_youtube_url': "🔗 Geçersiz YouTube URL!\n\nLütfen geçerli bir YouTube video linki girin. Örnek formatlar:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n\n💡 Linki kopyalarken tamamını seçtiğinizden emin olun.",
        
        # Video Errors
        'video_details_failed': "📹 Video bilgileri alınamadı!",
        'video_not_found': "Video bulunamadı. Bu durum şu sebeplerden olabilir:\n• Video silinmiş veya gizli\n• URL hatalı yazılmış\n• Video erişim kısıtlamasına sahip\n\n💡 URL'i kontrol edin ve geçerli, herkese açık bir video deneyin.",
        'video_private': "Bu video özel veya kısıtlı erişimli.\n\n💡 Herkese açık bir YouTube videosu deneyin.",
        'video_generic_error': "Teknik detay: {error}\n\n💡 Farklı bir video deneyin veya daha sonra tekrar deneyin.",
        
        # Duplicate Warnings
        'duplicate_warning': "⚠️ Aynı videoya daha önce yorum yapmışsınız!\n\nBu videoya toplam {count} kez yorum gönderildi. Sistem güvenliği için aynı videoya birden fazla yorum gönderilmesine izin verilmiyor.\n\n✅ Yeni yorum oluşturabilirsiniz\n❌ Ancak bu videoya gönderilemez",
        'duplicate_error': "🚫 Yorum gönderilemedi!\n\nBu videoya daha önce {count} kez yorum gönderildi. Sistem güvenliği ve spam önleme politikası gereği aynı videoya birden fazla yorum gönderilmesine izin verilmiyor.\n\n💡 Başka bir videoyu deneyin veya daha önce yorum yapmadığınız bir video seçin.",
        
        # AI Generation Errors
        'ai_generation_failed': "🤖 Yorum üretilirken hata oluştu!",
        'ai_api_key_error': "🔑 AI servis bağlantısında sorun var.\n\n💡 Sistem yöneticisi ile iletişime geçin veya daha sonra tekrar deneyin.",
        'ai_quota_error': "⏰ AI servis limit aşıldı.\n\n💡 Birkaç dakika bekleyip tekrar deneyin.",
        'ai_network_error': "🌐 İnternet bağlantısı sorunu.\n\n💡 Bağlantınızı kontrol edin ve tekrar deneyin.",
        'ai_generic_error': "Teknik detay: {error}\n\n💡 Sayfayı yenileyip tekrar deneyin.",
        
        # YouTube API Errors
        'youtube_post_failed': "🚫 Yorum gönderilirken hata oluştu!",
        'youtube_permission_error': "📝 Yorum gönderme izniniz yok. Bu durum şu sebeplerden olabilir:\n• YouTube hesabınız yorum yapma kısıtlamasına sahip\n• Video sahibi yorumları devre dışı bırakmış\n• Hesabınız henüz doğrulanmamış\n\n💡 YouTube hesabınızı kontrol edin ve daha sonra tekrar deneyin.",
        'youtube_quota_error': "⏰ API limit aşıldı. Sistem geçici olarak yoğun.\n\n💡 Birkaç dakika bekledikten sonra tekrar deneyin.",
        'youtube_not_found_error': "📹 Video bulunamadı veya erişilemiyor.\n\n💡 Video linkini kontrol edin ve geçerli, erişilebilir bir video olduğundan emin olun.",
        'youtube_generic_error': "Teknik detay: {error}\n\n💡 Sorun devam ederse farklı bir video deneyin veya daha sonra tekrar deneyin.",
        
        # Success Messages
        'comment_posted_success': "✅ Yorum başarıyla gönderildi!",
        'comment_generated_success': "✅ Yorum başarıyla oluşturuldu! YouTube'a gönderebilirsiniz.",
        
        # System Errors
        'system_error': "🔧 Beklenmeyen sistem hatası!\n\nTeknik detay: {error}\n\n💡 Sayfayı yenileyin ve tekrar deneyin. Sorun devam ederse sistem yöneticisi ile iletişime geçin.",
    },
    
    'ru': {
        # Validation Errors
        'no_data_sent': "📡 Данные не отправлены!\n\nНикаких данных не поступило на сервер.\n\n💡 Проверьте подключение к интернету и попробуйте еще раз.",
        'missing_video_url': "📝 Недостающая информация!\n\nТребуется URL видео YouTube.\n\n💡 Пожалуйста, введите действительную ссылку на видео YouTube.",
        'missing_language': "🌐 Требуется выбор языка!\n\nПожалуйста, выберите язык комментария.\n\n💡 Выберите из турецкого, английского или других доступных языков.",
        'missing_comment_style': "🎨 Требуется стиль комментария!\n\nПожалуйста, укажите стиль комментария.\n\n💡 Отсутствует информация в форме.",
        'form_validation_error': "📋 Данные формы недействительны!\n\nОтправленные данные недействительны.\n\nТехническая деталь: {error}\n\n💡 Обновите страницу и попробуйте еще раз.",
        'missing_comment_data': "📝 Недостающая информация! Требуется URL видео и текст комментария.",
        'invalid_youtube_url': "🔗 Недействительный URL YouTube!\n\nПожалуйста, введите действительную ссылку на видео YouTube. Примеры форматов:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n\n💡 Убедитесь, что вы выбрали полную ссылку при копировании.",
        
        # Video Errors
        'video_details_failed': "📹 Не удалось получить информацию о видео!",
        'video_not_found': "Видео не найдено. Это может быть связано с:\n• Видео удалено или закрыто\n• URL введен неправильно\n• Видео имеет ограничения доступа\n\n💡 Проверьте URL и попробуйте действительное, общедоступное видео.",
        'video_private': "Это видео закрытое или имеет ограниченный доступ.\n\n💡 Попробуйте общедоступное видео YouTube.",
        'video_generic_error': "Техническая деталь: {error}\n\n💡 Попробуйте другое видео или попробуйте позже.",
        
        # Duplicate Warnings
        'duplicate_warning': "⚠️ Вы уже комментировали это видео!\n\nВсего {count} комментариев отправлено к этому видео. Для безопасности системы не разрешается отправлять несколько комментариев к одному видео.\n\n✅ Вы можете создать новый комментарий\n❌ Но нельзя отправить к этому видео",
        'duplicate_error': "🚫 Комментарий не удалось отправить!\n\nВсего {count} комментариев уже отправлено к этому видео. Из-за политики безопасности системы и предотвращения спама не разрешается отправлять несколько комментариев к одному видео.\n\n💡 Попробуйте другое видео или выберите видео, которое вы еще не комментировали.",
        
        # AI Generation Errors
        'ai_generation_failed': "🤖 Ошибка при создании комментария!",
        'ai_api_key_error': "🔑 Проблема с подключением к AI сервису.\n\n💡 Свяжитесь с администратором системы или попробуйте позже.",
        'ai_quota_error': "⏰ Превышен лимит AI сервиса.\n\n💡 Подождите несколько минут и попробуйте еще раз.",
        'ai_network_error': "🌐 Проблема с подключением к интернету.\n\n💡 Проверьте соединение и попробуйте еще раз.",
        'ai_generic_error': "Техническая деталь: {error}\n\n💡 Обновите страницу и попробуйте еще раз.",
        
        # YouTube API Errors
        'youtube_post_failed': "🚫 Ошибка при отправке комментария!",
        'youtube_permission_error': "📝 У вас нет разрешения на публикацию комментариев. Это может быть связано с:\n• Ваш аккаунт YouTube имеет ограничения на комментарии\n• Владелец видео отключил комментарии\n• Ваш аккаунт еще не подтвержден\n\n💡 Проверьте свой аккаунт YouTube и попробуйте позже.",
        'youtube_quota_error': "⏰ Превышен лимит API. Система временно занята.\n\n💡 Попробуйте еще раз через несколько минут.",
        'youtube_not_found_error': "📹 Видео не найдено или недоступно.\n\n💡 Проверьте ссылку на видео и убедитесь, что это действительное, доступное видео.",
        'youtube_generic_error': "Техническая деталь: {error}\n\n💡 Если проблема продолжается, попробуйте другое видео или попробуйте позже.",
        
        # Success Messages
        'comment_posted_success': "✅ Комментарий успешно отправлен!",
        'comment_generated_success': "✅ Комментарий успешно создан! Вы можете отправить его на YouTube.",
        
        # System Errors
        'system_error': "🔧 Неожиданная системная ошибка!\n\nТехническая деталь: {error}\n\n💡 Обновите страницу и попробуйте еще раз. Если проблема продолжается, свяжитесь с администратором системы.",
    },
    
    'zh': {
        # Validation Errors
        'no_data_sent': "📡 未发送数据！\n\n服务器未收到任何数据。\n\n💡 检查您的网络连接并重试。",
        'missing_video_url': "📝 信息缺失！\n\n需要YouTube视频URL。\n\n💡 请输入有效的YouTube视频链接。",
        'missing_language': "🌐 需要选择语言！\n\n请选择评论语言。\n\n💡 从土耳其语、英语或其他可用语言中选择。",
        'missing_comment_style': "🎨 需要评论风格！\n\n请指定评论风格。\n\n💡 表单信息缺失。",
        'form_validation_error': "📋 表单数据无效！\n\n发送的数据无效。\n\n技术详情：{error}\n\n💡 刷新页面并重试。",
        'missing_comment_data': "📝 信息缺失！需要视频URL和评论文本。",
        'invalid_youtube_url': "🔗 无效的YouTube URL！\n\n请输入有效的YouTube视频链接。示例格式：\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n\n💡 复制时确保选择完整链接。",
        
        # Video Errors
        'video_details_failed': "📹 无法获取视频信息！",
        'video_not_found': "未找到视频。这可能是由于：\n• 视频已删除或私有\n• URL输入错误\n• 视频有访问限制\n\n💡 检查URL并尝试有效的公共视频。",
        'video_private': "此视频是私有的或有访问限制。\n\n💡 尝试公共YouTube视频。",
        'video_generic_error': "技术详情：{error}\n\n💡 尝试其他视频或稍后重试。",
        
        # Duplicate Warnings
        'duplicate_warning': "⚠️ 您已经评论过这个视频！\n\n总共有{count}条评论发送到这个视频。为了系统安全，不允许对同一视频发送多条评论。\n\n✅ 您可以创建新评论\n❌ 但不能发送到这个视频",
        'duplicate_error': "🚫 评论无法发送！\n\n之前已有{count}条评论发送到这个视频。由于系统安全和防垃圾邮件政策，不允许对同一视频发送多条评论。\n\n💡 尝试其他视频或选择您未评论过的视频。",
        
        # AI Generation Errors
        'ai_generation_failed': "🤖 生成评论时发生错误！",
        'ai_api_key_error': "🔑 AI服务连接有问题。\n\n💡 联系系统管理员或稍后重试。",
        'ai_quota_error': "⏰ AI服务限制已达到。\n\n💡 等待几分钟后重试。",
        'ai_network_error': "🌐 网络连接问题。\n\n💡 检查您的连接并重试。",
        'ai_generic_error': "技术详情：{error}\n\n💡 刷新页面并重试。",
        
        # YouTube API Errors
        'youtube_post_failed': "🚫 发送评论时发生错误！",
        'youtube_permission_error': "📝 您没有发布评论的权限。这可能是由于：\n• 您的YouTube帐户有评论限制\n• 视频所有者已禁用评论\n• 您的帐户尚未验证\n\n💡 检查您的YouTube帐户并稍后重试。",
        'youtube_quota_error': "⏰ API限制已达到。系统暂时繁忙。\n\n💡 几分钟后重试。",
        'youtube_not_found_error': "📹 找不到视频或无法访问。\n\n💡 检查视频链接并确保它是有效的、可访问的视频。",
        'youtube_generic_error': "技术详情：{error}\n\n💡 如果问题持续，尝试其他视频或稍后重试。",
        
        # Success Messages
        'comment_posted_success': "✅ 评论成功发送！",
        'comment_generated_success': "✅ 评论成功生成！您可以发送到YouTube。",
        
        # System Errors
        'system_error': "🔧 意外的系统错误！\n\n技术详情：{error}\n\n💡 刷新页面并重试。如果问题持续，请联系系统管理员。",
    },
    
    'ja': {
        # Validation Errors
        'no_data_sent': "📡 データが送信されていません！\n\nサーバーにデータが届いていません。\n\n💡 インターネット接続を確認して再試行してください。",
        'missing_video_url': "📝 情報が不足しています！\n\nYouTube動画URLが必要です。\n\n💡 有効なYouTube動画リンクを入力してください。",
        'missing_language': "🌐 言語選択が必要です！\n\nコメント言語を選択してください。\n\n💡 トルコ語、英語、または他の利用可能な言語から選択してください。",
        'missing_comment_style': "🎨 コメントスタイルが必要です！\n\nコメントスタイルを指定してください。\n\n💡 フォーム情報が不足しています。",
        'form_validation_error': "📋 フォームデータが無効です！\n\n送信されたデータが無効です。\n\n技術詳細：{error}\n\n💡 ページを更新して再試行してください。",
        'missing_comment_data': "📝 情報が不足しています！動画URLとコメントテキストが必要です。",
        'invalid_youtube_url': "🔗 無効なYouTube URL！\n\n有効なYouTube動画リンクを入力してください。例のフォーマット：\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n\n💡 コピー時に完全なリンクを選択していることを確認してください。",
        
        # Video Errors
        'video_details_failed': "📹 動画情報を取得できませんでした！",
        'video_not_found': "動画が見つかりません。これは以下の理由による可能性があります：\n• 動画が削除されているか非公開\n• URLが間違って入力されている\n• 動画にアクセス制限がある\n\n💡 URLを確認し、有効な公開動画を試してください。",
        'video_private': "この動画は非公開またはアクセス制限があります。\n\n💡 公開YouTubeビデオを試してください。",
        'video_generic_error': "技術詳細：{error}\n\n💡 別の動画を試すか、後で再試行してください。",
        
        # Duplicate Warnings
        'duplicate_warning': "⚠️ この動画には既にコメントしています！\n\nこの動画には合計{count}件のコメントが送信されています。システムセキュリティのため、同じ動画への複数コメントは許可されていません。\n\n✅ 新しいコメントを作成できます\n❌ ただし、この動画には送信できません",
        'duplicate_error': "🚫 コメントを送信できませんでした！\n\nこの動画には以前に{count}件のコメントが送信されています。システムセキュリティとスパム防止ポリシーにより、同じ動画への複数コメントは許可されていません。\n\n💡 別の動画を試すか、コメントしていない動画を選択してください。",
        
        # AI Generation Errors
        'ai_generation_failed': "🤖 コメント生成中にエラーが発生しました！",
        'ai_api_key_error': "🔑 AIサービス接続に問題があります。\n\n💡 システム管理者に連絡するか、後で再試行してください。",
        'ai_quota_error': "⏰ AIサービス制限に達しました。\n\n💡 数分待ってから再試行してください。",
        'ai_network_error': "🌐 インターネット接続の問題。\n\n💡 接続を確認して再試行してください。",
        'ai_generic_error': "技術詳細：{error}\n\n💡 ページを更新して再試行してください。",
        
        # YouTube API Errors
        'youtube_post_failed': "🚫 コメント送信中にエラーが発生しました！",
        'youtube_permission_error': "📝 コメントを投稿する権限がありません。これは以下の理由による可能性があります：\n• YouTubeアカウントにコメント制限がある\n• 動画所有者がコメントを無効にしている\n• アカウントがまだ確認されていない\n\n💡 YouTubeアカウントを確認して後で再試行してください。",
        'youtube_quota_error': "⏰ API制限に達しました。システムが一時的に混雑しています。\n\n💡 数分後に再試行してください。",
        'youtube_not_found_error': "📹 動画が見つからないかアクセスできません。\n\n💡 動画リンクを確認し、有効でアクセス可能な動画であることを確認してください。",
        'youtube_generic_error': "技術詳細：{error}\n\n💡 問題が続く場合は、別の動画を試すか後で再試行してください。",
        
        # Success Messages
        'comment_posted_success': "✅ コメントが正常に送信されました！",
        'comment_generated_success': "✅ コメントが正常に生成されました！YouTubeに送信できます。",
        
        # System Errors
        'system_error': "🔧 予期しないシステムエラーが発生しました！\n\n技術詳細：{error}\n\n💡 ページを更新して再試行してください。問題が続く場合は、システム管理者に連絡してください。",
    }
}

def get_message(language_code, message_key, **kwargs):
    """
    Get localized message by language code and message key
    
    Args:
        language_code (str): Language code (en, tr, ru, zh, ja)
        message_key (str): Message key from MESSAGES dict
        **kwargs: Format parameters for the message
    
    Returns:
        str: Localized message
    """
    # Normalize language code
    lang_map = {
        'turkish': 'tr',
        'english': 'en', 
        'russian': 'ru',
        'chinese': 'zh',
        'japanese': 'ja'
    }
    
    if language_code.lower() in lang_map:
        language_code = lang_map[language_code.lower()]
    
    # Get message from dict with fallback to English
    messages = MESSAGES.get(language_code, MESSAGES['en'])
    message = messages.get(message_key, MESSAGES['en'].get(message_key, f"Message not found: {message_key}"))
    
    # Format message with parameters
    try:
        return message.format(**kwargs)
    except (KeyError, ValueError):
        return message