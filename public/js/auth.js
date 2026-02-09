document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".auth-form");
    if (!form) return;

    const setError = (id, message) => {
        const element = document.getElementById(id);
        if (element) element.textContent = message;
    };

    const clearErrors = () => {
        document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const nameField = document.getElementById("firstname");
    const isRegistration = !!nameField;

    const isAdminLogin = form.id === "admin-form";


    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value; 
    let hasError = false;

    const body = { email, password };

    if (isRegistration) {
        const firstname = nameField.value.trim();
        const lastname = document.getElementById("lastname")?.value.trim() || "";
        const telephone = document.getElementById("telephone")?.value.trim() || "";

        if (!firstname) { setError("nameError", "*Введите имя"); hasError = true; }
        if (!telephone) { setError("telephoneError", "*Введите телефон"); hasError = true; }
        if (password.length < 6) { setError("passwordError", "*Минимум 6 символов"); hasError = true; }

        body.firstname = firstname;
        body.lastname = lastname;
        body.telephone = telephone;
    } else {
 
        if (!email) { setError("emailError", "*Введите E-mail"); hasError = true; }
        if (!password) { setError("passwordError", "*Введите пароль"); hasError = true; }
    }

    if (hasError) return; 

    
    let endpoint;
        if (isAdminLogin) {
            endpoint = "/api/admin/login";
        } else{
            endpoint = isRegistration ? "/api/auth/register" : "/api/auth/login";
        }
    
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body) 
            });

            const data = await res.json(); 
            if (res.ok) {
                if (isRegistration) {
                    window.location.href = "/login";
                }else if(isAdminLogin){
                    window.location.href = "/admin/dashboard";
                } 
                else {
                    localStorage.setItem("role", data.user.role);
                    window.location.href = "/";
                }
            } else {
                handleBackendErrors(data.error);
            }
        } catch (err) {
            console.log(err.message);
        }
    });


    function handleBackendErrors(error) {
        if (typeof error === 'object' && error !== null) {
            if (error.email) setError("emailError", error.email);
            if (error.password) setError("passwordError", error.password);
            if (error.firstname) setError("nameError", error.firstname);
            if (error.lastname) setError("lastnameError", error.lastname);
            if (error.telephone) setError("telephoneError", error.telephone);
        } else {}
    }
});