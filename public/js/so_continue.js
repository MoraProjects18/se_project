$(document).ready(function(){
    $("#so_cts").click(function(){
      const so_id = $(this).val();
      $.post(
            "/receptionist/sorder/continue",
            {
              service_order_id   :parseInt(so_id),
            },
            function (data, status) {
              if (status=="success"){
                if(!alert("Service Order " + so_id+ " continued Successfully")){
                  $("#so_cts").prop("disabled",true);
                } 
              } else {
                alert("Error occured Try Again");
              }
            }
        );
  });
});
