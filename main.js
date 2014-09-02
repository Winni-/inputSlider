$.fn.slider = function() { 
        'use strict'       
        if(!$(this).attr("max")){
            console.log("Max attr is not defined for"+ $(this));
            return;
        }
        $(this).wrap(function() {
            return "<div class='slider' style='width:"+$(this).outerWidth()+"px; height:"+ ($(this).outerHeight() ? $(this).outerHeight() : 34) +"px'>";
        });
        $(this).parent().append("<div class='slid'>");
        var isDragging = false;
        $(this).each(function(index,elem) {
            var points = $(this).attr("data-points");
            points = points ? points.split(",") : [] ;
            var newPoints = [];
            if(points.length){
                for(var num in points){
                    newPoints.push(parseInt(points[num]));
                }
                this.points = newPoints;
            }
            this.step = $(this).data("step")?parseInt($(this).data("step")):1;      

        });
        $(".slid").mousedown(function() {
            
            var that = this;
            var max = $(this).parent().width() - 45;
            var $input = $(this).parent().children("input");
            var input = $input[0];
            var points = [];            
            var step = +input.step;
            if (typeof input.points !== "undefined") {
                points = input.points;
            };          
            $(window).mousemove(function(event) {
                isDragging = true;
                var position = 0;
                var cl = 0;
                var align = "right";
                if(isDragging){
                    position = event.pageX - $(that).parent().offset().left;
                    position -= 8;
                    if (position< -8){ position = -8 };
                    if (position> max) { position = max};
                    $(that).css("left", position );
                    var min = parseInt($input.attr("min"))?parseInt($input.attr("min")):0;
                    var value = Math.min( Math.floor((position/max)* ($input.attr("max")-min))+min,parseInt($input.attr("max")) );
                    if (value<0|| value<min) {value = Math.max(0,min)};
                    var result = value;
                    
                    if (points.length) {
                        result = near(value,points);
                    };
                    
                    if (step>1 && step<=parseInt($input.attr("max"))) {
                        var amount = Math.floor(value/step);
                        
                        if(value%step > step/2){
                            result = step*amount + step;
                        }else if(value%step < step/2){
                            result = step*amount;
                        };                        
                    };
                    
                    if(position > max/2){
                        align = "left";
                    }else{
                        align ="right";
                    }
                    $input.css("text-align", align);
                    $input.val(result);
                }
            });
        });
        $(window).mouseup(function() {
            var wasDragging = isDragging;
            isDragging = false;
            $(window).unbind("mousemove");

        });
        $(this).on("change", function() {
            var value = $(this).val();
            if(parseInt($(this).val())<parseInt($(this).attr("min"))){
                $(this).val($(this).attr("min"))
            }
            if(parseInt($(this).val()) > parseInt($(this).attr("max"))){
                $(this).val($(this).attr("max"));
            }

            if($.inArray($(this).val(), points)<0){
                $(this).val(near($(this).val(),points));
            }
            if (step>1 && step<parseInt($(this).attr("max"))) {
                var amount = Math.floor(value/step);
                
                if(value%step > step/2){
                    result = step*amount + step;
                }else if(value%step < step/2){
                    result = step*amount;
                };  
                $(this).val(result);                      
            };
            var position = ($(this).val() / $(this).attr("max")) * ($(this).parent().width() - 45);
            $(this).parent().children(".slid").stop().animate({"left": position}, 200);
        });
        
    };