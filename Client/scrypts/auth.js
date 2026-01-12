// fetching login api

async function loginUser(username, password){
    
    const response = await fetch("/auth/jwtlogin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"  
        },
        body: JSON.stringify({username, password})
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || "Login Failed");
    }

    return data;
}


// sign up function

async function signupUser(username, password){
    const response = await fetch("/auth/jwtsignup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || "signup failed");
    }

    return true;
}

