exports.home = async (req, res) => {
  res.status(200).render("guest/home_page", {
    usertype: "guest",
    activepage: "Home",
    title: "Home",
  });
};
