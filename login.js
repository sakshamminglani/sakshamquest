
async function storeCredentials() {
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Encrypt the password using the encryptData function
    const { encryptedData, iv } = await encryptData(password);
    const encryptedPassword = btoa(JSON.stringify({ encryptedData, iv }));

    const storedPassword = localStorage.getItem(username);

    if (!storedPassword) {
        const isSignUp = confirm("User not found. Do you want to sign up?");
        if (isSignUp) {
            // Store the encrypted password
            localStorage.setItem(username, encryptedPassword);
            alert("Sign up successful! Please log in with your new account.");
        }
    } else {
        // Decrypt the stored password using the decryptData function
        const storedPasswordObj = JSON.parse(atob(storedPassword));
        const decryptedPassword = await decryptData(
            storedPasswordObj.encryptedData,
            storedPasswordObj.iv
        );

        if (password === decryptedPassword) {
            sessionStorage.setItem("username", username);
            window.location.href = "game.html"; // Navigate to the game page
        } else {
            alert("Incorrect password. Please try again.");
        }
    }

    // Clear the password input field
    document.querySelector('input[name="password"]').value = "";
}

// Call the storeCredentials function when the login button is clicked
document.querySelector('#loginBtn').addEventListener('click', storeCredentials);


// Encrypt data before storing in localStorage
async function encryptData(data) {
    // Convert data to Uint8Array
    const dataBuffer = new TextEncoder().encode(data);

    // Generate a random encryption key
    const encryptionKey = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );

    // Encrypt the data using the encryption key
    const encryptedDataBuffer = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: window.crypto.getRandomValues(new Uint8Array(12))
        },
        encryptionKey,
        dataBuffer
    );

    // Convert the encrypted data to a base64-encoded string
    const encryptedData = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedDataBuffer)));

    // Store the encrypted data in localStorage
    localStorage.setItem("encryptedData", encryptedData);

    // Store the encryption key in localStorage
    const exportedEncryptionKey = await window.crypto.subtle.exportKey("jwk", encryptionKey);
    localStorage.setItem("encryptionKey", JSON.stringify(exportedEncryptionKey));

    return { encryptedData, iv: encryptedDataBuffer.slice(0, 12) };
}

// Decrypt data from localStorage
async function decryptData(encryptedData, iv) {
    // Retrieve the encryption key from localStorage
    const exportedEncryptionKey = JSON.parse(localStorage.getItem("encryptionKey"));
    const encryptionKey = await window.crypto.subtle.importKey(
        "jwk",
        exportedEncryptionKey,
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );

    // Convert the encrypted data from a base64-encoded string to a Uint8Array
    const encryptedDataBuffer = new Uint8Array(atob(encryptedData).split("").map(char => char.charCodeAt(0)));

    // Decrypt the data using the encryption key
    const decryptedDataBuffer = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv
        },
        encryptionKey,
        encryptedDataBuffer.slice(12)
    );

    // Convert the decrypted data to a string
    const decryptedData = new TextDecoder().decode(decryptedDataBuffer);

    return decryptedData;
}
