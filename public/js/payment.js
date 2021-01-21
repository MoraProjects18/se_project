const service_order_id = $("#service_order").val();
$("#payBtn").click(function () {
  alert("Are you sure?");

  $.post(
    "/cashier/invoice/pay",
    {
      service_order_id: service_order_id,
    },
    function (data, status) {
      $("#status").val("Paid");
      $("#payBtn").attr("disabled", "disabled");
      alert("Data: " + data.message + "\nStatus: " + status);
    }
  );
});

$("#closeBtn").click(function () {
  alert("Are you sure?");

  $.post(
    "/cashier/invoice/close",
    {
      service_order_id: service_order_id,
    },
    function (data, status) {
      $("#status").val("Closed");
      $("#closeBtn").attr("disabled", "disabled");
      alert("Data: " + data.message + "\nStatus: " + status);
    }
  );
});
