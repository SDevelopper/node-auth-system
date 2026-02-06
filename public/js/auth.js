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

        const nameField = document.getElementById("name");
        const isRegistration = !!nameField;
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        let hasError = false;

        if (!email) { setError("emailError", "*Введите E-mail"); hasError = true; }
        if (!password) { setError("passwordError", "*Введите пароль"); hasError = true; }

        if (isRegistration) {
            const name = nameField.value.trim();
            const telephone = document.getElementById("telephone")?.value.trim();

            if (!name) { setError("nameError", "*Введите имя"); hasError = true; }
            if (!telephone) { setError("telephoneError", "*Введите телефон"); hasError = true; }
            if (password && password.length < 6) { 
                setError("passwordError", "*Минимум 6 символов"); 
                hasError = true; 
            }
        }

        if (hasError) return; 

        const endpoint = isRegistration ? "/api/auth/register" : "/api/auth/login";
        
        const body = { email, password };
        if (isRegistration) {
            body.name = document.getElementById("name").value.trim();
            body.lastname = document.getElementById("lastname")?.value.trim() || "";
            body.telephone = document.getElementById("telephone")?.value.trim() || "";
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
                } else {
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
            if (error.name) setError("nameError", error.name);
            if (error.lastname) setError("lastnameError", error.lastname);
            if (error.telephone) setError("telephoneError", error.telephone);
        } else {}
    }
});