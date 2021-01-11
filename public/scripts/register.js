const inputs = document.querySelectorAll(".input");

document.getElementById("empid").style.display = "none"; 
document.getElementById("stfbtn").style.display = "none"; 

function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});


function hide(){
    document.getElementById("empid").style.display = "none"; 
    document.getElementById("stfbtn").style.display = "none"; 
    document.getElementById("cstbtn").style.display = "block";
};

function show(){
    document.getElementById("empid").style.display = "grid"; 
    document.getElementById("cstbtn").style.display = "none"; 
    document.getElementById("stfbtn").style.display = "block"; 
};

