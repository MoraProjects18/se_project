$("#startso").click(function () {
    const user_id = $("#form_userid").val();
    const vehicle = $("#selectvehicle").val();
    const pay = $("#form_pay").val();

      $.ajax({
        type: "POST",
        url: "/receptionist/sorder/initiate",
        data:  {
                user_id         :parseInt(user_id),
                vehicle_number  :vehicle,
                start_date      :getDate(),
                payment_amount  :pay
              },
        dataType: "json",
        success: function(data,status) {
          $("#startso").prop("disabled",true);
          alert("Service Order Initiated Successfully. \nService Order ID : "+data.service_order_id
                 + "\nInvoice ID : " + data.invoice_id)        
        },
        error: function(data,status){
            alert(data.responseText+ "\nTry Again")    
        }
    });    
  });

  $("#add").click(function () {
    const user_id = $("#user").val();
    const reg_no = $("#regno").val();
    const engine_no = $("#engineno").val();
    const model_no = $("#modelno").val();
    const model = $("#model").val();

    $.ajax({
      type: "POST",
      url: "/receptionist/addvehicle",
      data:  {
                user_id             :parseInt(user_id),
                registration_number : reg_no,
                engine_number       : engine_no,
                model_number        : model_no,
                model               : model
              },
      dataType: "json",
      success: function(data,status) {
        if(!alert("Vehicle added Successfully")){
          location.reload(true);
        }      
      },
      error: function(data,status){
          alert(data.responseText+ "\nTry Again")    
      }
    });    
  });

//function to get date and time return format 2021-1-13 18:24:57
function getDate() {
    var today = new Date();
    var date =
      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    return dateTime;
  }