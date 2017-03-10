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
            render(data);
        }
    });

    function render(data){
        if(!data && data.length === 0){
            alert('请求文章数据失败！');
        }

        $box.empty();

        $(data).each(function(j,val){
            var $articlItem = $('#template div.mix').clone();

            $articlItem.find('[data-key]').each(function(i,item){
                $(item).text(eval('val.' + $(item).attr('data-key')));
            });
            console.log($articlItem);
            $box.append($articlItem);
        });
    }
});