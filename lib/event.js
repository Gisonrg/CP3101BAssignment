//main execution function
$(function(){
	// check if the user has logged in when the document is loaded.
	checkLogin();
	/*******************/
	/*	Event handler  */
	/*******************/

    setInterval(slideSwitch, 1400);
    setInterval(horseBlink, 100);
	/* 
		Login form related
	*/
	$('#login_form input').focus(function(){
		$('#login_form > .form_alert').hide();
		$('#login_form .form_alert .alert-text').html('');
		$('#login_form input').css("border-color","#DADADA");
	});

	//login button
	$("#login_submit").click(function(event){
	 	event.preventDefault();
	 	authenticate();
	});

	/* 
		Register form related
	*/
	$("#reg-name").focus(function(){
		hideElement('#register_form .form_alert');
		showElement('#register_form .form_info');
		$('#register_form .form_info').html('Username should contain only English characters, numbers, and underscore (_) with length 4-20.');
	});
	$("#reg-email").focus(function(){
		hideElement('#register_form .form_alert');
		showElement('#register_form .form_info');
		$('#register_form .form_info').html('Please enter a valid email address.');
	});
	$("#reg-psw").focus(function(){
		hideElement('#register_form .form_alert');
		showElement('#register_form .form_info');
		$('#register_form .form_info').html('Password should contain only English characters and numbers with length 6-20.');
	});
	$("#reg-rpsw").focus(function(){
		hideElement('#register_form .form_alert');
		showElement('#register_form .form_info');
		$('#register_form .form_info').html('Please confirm your password.');
	});

	$("#register_submit").click(function(event){
		event.preventDefault();
		var checked = true;
		var message = '';
		// claer existing error message 
		$('#register_form .form_alert .alert-text').html('');
		// flag for error checking
		var v_username_format = false;
		var v_username_repeat = false;
		var v_email = false;
		var v_password = false;
		var v_repassword = false;

		var name = $("#reg-name").val();
		var jqXHR = $.getJSON("service/userRetrieve.php", {user_query: name}, function(data) {
			if (data['status'] == 'Success') {
				if (verify_username(name)) {
					$("#reg-name").css("border-color","#2ecc71");
				} else {
					$('#reg-name').css("border-color","red");
			      	$('#register_form .form_alert .alert-text').append('Please check your username format.<br />');
				  	hideElement('#register_form .form_info');
				  	showElement('#register_form .form_alert');
				  	checked=false;
				}
			} else {
				$('#reg-name').css("border-color","red");
		      	$('#register_form .form_alert .alert-text').append('This username has already been registered.<br />');
				hideElement('#register_form .form_info');
			  	showElement('#register_form .form_alert');
			  	checked=false;
			}
		});

		if (verify_email("#reg-email")) {
			$("#reg-email").css("border-color","#2ecc71");
		} else {
			$('#reg-email').css("border-color","red");
	      	v_email = true;
			hideElement('#register_form .form_info');
		  	showElement('#register_form .form_alert');
		  	checked=false;
		}

	    //regular expression check
        if (!verify_password('#reg-psw')) {
         	$('#reg-psw').css("border-color","red");
	  		v_password = true;
			hideElement('#register_form .form_info');
	  		showElement('#register_form .form_alert');
	  		checked=false;
        } else {
        	$("#reg-psw").css("border-color","#2ecc71");
        }

		if (!verify_password('#reg-rpsw')) {
         	$('#reg-rpsw').css("border-color","red");
         	v_password = true;
         	hideElement('#register_form .form_info');
	  		showElement('#register_form .form_alert');
	  		checked=false;
        } else {
			if ($('#reg-rpsw').val() != $('#reg-psw').val()) {
				$('#reg-rpsw').css("border-color", "red");
				v_repassword = true;
				hideElement('#register_form .form_info');
				showElement('#register_form .form_alert');
				checked=false;
			} else {
				$('#reg-rpsw').css("border-color", "#2ecc71");
			}
		}   
		// Add handlers to be called when the the query is done.
		jqXHR.done(function() {
			if (checked) {
				validate();
			} else {
				if (v_email) {
					message+="Please check your email format.<br />";						
				}
				if (v_password) {
					message+="Please check your password format.<br />";	
				}
				if (v_repassword) {
					message+="Please enter the same new password.<br />";	
				}
				$('#register_form .form_alert .alert-text').append(message);
			}
		});
		
	});

	/* 
		Account update form related
	*/
	$("#account-email").change(function() {
		//kill error message
		if (verify_email("#account-email")) {
			$('#account-email').css("border-color","#2ecc71");
			hideElement('#account-form .form_alert');
		} else {
			$('#account-email').css("border-color","red");
	      	$('#account-form .form_alert .alert-text').html('Please verify your Email address.');
		  	showElement('#account-form .form_alert');
		}
		
    });

	$("#o_password").focus(function() {
		//kill error message
		$('#o_password').css("border-color","#DADADA");
		$('#account-form .form_alert').hide();
		$('#account-form .form_alert .alert-text').html('');
    });

	$("#o_password").change(function() {
		//kill error message
		if ($(this).val()!='') {
			$('#n_password').prop('disabled', false);
			$('#r_password').prop('disabled', false);
    		$('#account-form .form_alert').hide();
			$('#account-form .form_alert .alert-text').html('');
		} else {
			$('#n_password').prop('disabled', true);
			$('#n_password').css("border-color","#DADADA");
			$('#n_password').val('');
			$('#r_password').prop('disabled', true);
			$('#r_password').css("border-color","#DADADA");
			$('#r_password').val('');
			
		}
    });

	$("#n_password").change(function() {
	    // empty the re-type password field
	    $("#r_password").val('');
	    //regular expression check
        if (!verify_password('#n_password')) {
         	$('#n_password').css("border-color","red");
	  		$('#account-form .form_alert .alert-text').html('Please check your password format!');
	  		showElement('#account-form .form_alert');
        } else {
        	$('#account-form .form_alert').hide();
        	$('#n_password').css("border-color","#2ecc71");
        }
	});

	$("#r_password").change(function() {
		if (!verify_password('#r_password')) {
         	$('#r_password').css("border-color","red");
         	$('#account-form .form_alert .alert-text').html('Please check your password format!');
	  		showElement('#account-form .form_alert');
        } else {
			if ($(this).val() != $('#n_password').val()) {
				$('#r_password').css("border-color", "red");
				$('#account-form .form_alert .alert-text').html('Please enter the same new password.');
				showElement('#account-form .form_alert');
			} else {
				$('#account-form .form_alert').hide();
				$('#r_password').css("border-color", "#2ecc71");
			}
		}   
	});

	$("#update_submit").click(function(event){
		event.preventDefault();
		if (verify_email('#account-email')) {
			if ($('#o_password').val()=='') {
				 user_update();
			} else {
				// the user want to change the passowrd
				if ($('#n_password').val()==$('#r_password').val() && $('#n_password').val()!='') {
					user_update();
				 } else {
				 	$('#n_password').css("border-color","red");
				 	$('#r_password').css("border-color","red");
			      	$('#account-form .form_alert .alert-text').html('Please check your new password.');
				  	showElement('#account-form .form_alert');
				 }
			}
		} else {
			$('#account-email').css("border-color","red");
	      	$('#account-form .form_alert .alert-text').html('Please verify your Email address.');
		  	showElement('#account-form .form_alert');
		}
	});


	/* 
		Task create form
	*/
	$('#newtask_title').change(function(){
		if ($(this).val().trim().length>30 || $(this).val().trim().length==0) {
			$(this).css("border-color","red");
	      	$('#newtask_form .form_alert .alert-text').html('Please check your title format (0-30 characters).');
		  	showElement('#newtask_form .form_alert');
		} else {
			$(this).css("border-color","");
			hideElement('#newtask_form .form_alert');
		}
	});

	//validate create task form
	$("#task_create_submit").click(function(event){
		event.preventDefault();
		var title = $('#newtask_title').val().trim();
		var description = $("#newtask_description").val().trim();
		var duration = $('#newtask_form #duration-field').val();
		if (title.length>40 || title.length==0) {
			$('#newtask_title').css("border-color","red");
	      	$('#newtask_form .form_alert .alert-text').html('Please check your title format (0-30 characters).');
		  	showElement('#newtask_form .form_alert');
		} else if (duration=='' || duration>50) {
			$('#duration-field').css("border-color","red");
	      	$('#newtask_form .form_alert .alert-text').html('Please enter a valid number.(1 - 50)');
	      	showElement('#newtask_form .form_alert');
		} else {
			create_task(title, description, duration);
		}
	});

	$("#duration-button-plus").click(function(event){
		event.preventDefault();
		plus_duration();
	});

	$("#duration-button-minus").click(function(event){
		event.preventDefault();
		minus_duration();
	});

	/*
		Edit task
	*/
	$('#update_title').change(function(){
		if ($(this).val().length>30) {
			$(this).css("border-color","red");
	      	$('.task-update .form_alert .alert-text').html('The length of the title should less than 30 chars.');
		  	showElement('.task-update .form_alert');
		} else {
			$(this).css("border-color","");
			hideElement('.task-update .form_alert');
		}
	});

	$("#task_update_submit").click(function(event){
		event.preventDefault();
		var title = $('#update_title').val().trim();
		var description = $('#update_description').val().trim();
		var time = $('.task-update #duration-field').val();
		if (title.length>40 || title.length==0) {
			$('#update_title').css("border-color","red");
	      	$('.task-update .form_alert .alert-text').html('Please check your title format.');
		  	showElement('.task-update .form_alert');
		} else if (time=='' || time>50) {
			$('.task-update #duration-field').css("border-color","red");
	      	$('.task-update .form_alert .alert-text').html('Please enter a valid number.(1 - 50)');
	      	showElement('.task-update .form_alert');
		} else {
			update_task($(this).data().taskid, title, description);
		}
	});




	//navigator, which acts as a controller
	$("nav>ul>li>a").click(function(event){
		event.preventDefault();
		//Set destination page
		var dest = $(this).attr('id').substring(4);
		if (dest != locate) {
			// switch ui
			// redirect to the target page
			redirect(dest);
		}
	});

	//side bar navigator
	$("#user-service li a").click(function(event){
		event.preventDefault();
		//Set destination page
		var dest = $(this).attr('id').substring(4);
		if (dest != locate) {
			// switch ui
			// redirect to the target page
			redirect(dest);
		}
	});

	$('#found-psw>a').click(function(event) {
		event.preventDefault();
		var data = $(this).data();
		redirect(data.mode);
	});

	$('#tag-right button').click(function(event) {
		event.preventDefault();
		var data = $(this).data();
		redirect(data.mode);
	});

	$('#warn a').click(function(event) {
		event.preventDefault();
		var data = $(this).data();
		redirect(data.mode);
	});

});

