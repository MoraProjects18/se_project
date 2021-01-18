$(document).ready(function(){
    $("#so_cts").click(function(){
      const so_id = $(this).val();

      $.ajax({
        type: "POST",
        url: "/receptionist/sorder/continue",
        data:      {
                      service_order_id   :parseInt(so_id),
                    },
        dataType: "json",
        success: function(data,status) {
          if(!alert("Service Order " + so_id+ " continued Successfully")){
            location.reload(true);
            $("#so_cts").prop("disabled",true);
          } 
        },
        error: function(data,status){
            alert(data.responseText+ "\nTry Again")    
        }
    });    
  });
});
