$(function(){
    var $box = $('#Grid');

    $.ajax({
        url:'/reprintArticle/queryByPage.node',
        type: 'post',
        data: JSON.stringify({pageNum:1,pageSize:10}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function(data){
            templateFunc(data);
        }
    });

    function templateFunc(data){
        if(!data && data.list.length === 0){
            alert('请求文章数据失败！');
        }

        $box.empty();

        $(data.list).each(function(j,val){
            var $articlItem = $('#template div.mix').clone();

            $articlItem.find('[data-key]').each(function(i,item){
                $(item).text(eval('val.' + $(item).attr('data-key')));
            });
            
            $box.append($articlItem);
        });
    }
});