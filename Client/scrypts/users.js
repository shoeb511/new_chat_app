
async function loadAllUsers(authToken){
    try {
        const response = await fetch("/user/allusers", {
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });

        const users = await response.json();
        console.log("fetched users", users);

        renderUsers(users);

    } catch(error) {
        throw new Error("failed to load users. : ", error.message );
    }
}

