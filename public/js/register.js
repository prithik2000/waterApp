//client-side registration validation
$(document).ready(function() {
  $("#inputEmail_error").hide();
  $("#inputUsername_error").hide();
  $("#inputPassword_error").hide();
  $("#inputConfirmPassword_error").hide();

  var error_email = false;
  var error_username = false;
  var error_password = false;
  var error_cpassword  = false;

  $("#inputEmail").focusout(function(){
    check_email();
  });

  $("#inputUsername").focusout(function(){
    check_username();
  });

  $("#inputPassword").focusout(function(){
    check_password();
  });

  $("#inputConfirmPassword").focusout(function(){
    check_cpassword();
  });



// email address validation
  function check_email(){
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var email = $("#inputEmail").val();
    var valid =  regex.test(email);
    if(valid === true){
      $("#inputEmail_error").hide();
      $("#inputEmail").removeClass("is-invalid");
      
      $.post("../request/verification/checkEmailTaken.php",
    		  {
    		    email: email
    		  },
    		  function(data, status){
    			  console.log(data);
    		    if (data == "available") {
    		    	$("#inputEmail").addClass("is-valid");
    		    } else {
    		    	$("#inputEmail").addClass("is-invalid");
    		    	$("#inputEmail_error").html("Email associated with another account");
    		    	$("#inputEmail_error").show();
    		    }
    		  });
    }
    else{
      $("#inputEmail_error").html("Email Address Invalid");
      $("#inputEmail_error").show();
      $("#inputEmail").addClass("is-invalid");
    }
  }
// username validation
  function check_username(){
    var username = $("#inputUsername").val();
    var pattern = /^[a-zA-Z0-9]*$/;
    if(pattern.test(username) && username !== ''){
      $("#inputUsername_error").hide();
      $("#inputUsername").removeClass("is-invalid");
      
      $.post("../request/verification/checkUNameTaken.php",
    		  {
    		    username: username
    		  },
    		  function(data, status){
    			  console.log(data);
    		    if (data == "available") {
    		    	$("#inputUsername").addClass("is-valid");
    		    } else {
    		    	$("#inputUsername").addClass("is-invalid");
    		    	$("#inputUsername_error").html("Username Taken");
    		    	$("#inputUsername_error").show();
    		    }
    		  });
    }
    else{
      $("#inputUsername_error").html("Only Characters and Numbers Allowed");
      $("#inputUsername_error").show();
      $("#inputUsername").addClass("is-invalid");
    }
  }
// password validation
  function check_password(){
    var pattern = /(?=^.{8,20}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-z]))((?=(.*\d){1,})|(?=(.*\W){1,}))^.*$/;
    var password  = $("#inputPassword").val();
    if(pattern.test(password) && password !== ''){
      $("#inputPassword_error").hide();
      $("#inputPassword").removeClass("is-invalid");
    }
    else{
      $("#inputPassword_error").html("Password needs 8-20 characters with at least 1 number, 1 lowercase letter, and 1 uppercase letter");
      $("#inputPassword_error").show();
      $("#inputPassword").addClass("is-invalid");
    }
  }
// cpassword validation
  function check_cpassword(){
    var pass1 = $("#inputPassword").val();
    var pass2 = $("#inputConfirmPassword").val();
    if(pass1 === pass2){
      $("#inputConfirmPassword_error").hide();
      $("#inputConfirmPassword").removeClass("is-invalid");
    }
    else{
      $("#inputConfirmPassword_error").html("Passwords do not match");
      $("#inputConfirmPassword_error").show();
      $("#inputConfirmPassword").addClass("is-invalid");
    }
  }
});
