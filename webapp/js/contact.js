$(function(){
    $('#sendEmail').on('click', function(){
        var contactEmail = $('#contactEmail').val(),
            contactMessage = $('#contactMessage').val(),
            contactTitle = $('#contactTitle').val();
            
        var obj = {
            text : '《' contactTitle + '》' + ' form ' + contactEmail,
            contentHtml : contactTitle
        }

        $.ajax({
            type: 'post',
            url: '/reprintArticle/sendEmail.node',
            data: JSON.stringify(obj),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function(data){
                if(data === 'success'){
                    alert('发送成功！');
                }
            }
        })
    });
})