$("#startso").click(function () {
    const user_id = $("#form_userid").val();
    const vehicle = $("#selectvehicle").val();
    const pay = $("#form_pay").val();
    $.post(
        "/receptionist/sorder/initiate",
        {
          user_id         :parseInt(user_id),
          vehicle_number  :vehicle,
          start_date      :getDate(),
          payment_amount  :pay
        },
        function (data, status) {
          if(data !== ''){
            if(!alert("Service Order Initiated Successfully. \nService Order ID : "+data.service_order_id
                + "\nInvoice ID : " + data.invoice_id
            )){
              $("#startso").prop("disabled",true);
            } 
          } else {
            alert("Error occured Try Again");
          }
        }
      );
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