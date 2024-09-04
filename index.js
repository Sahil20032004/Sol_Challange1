// Import Solana web3 functionalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

// Create a new keypair
const newPair = new Keypair();

// Extract the public and private key from the keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Public Key of the generated keypair:", publicKey);

// Get the public key from the command line arguments
const userPublicKey = process.argv[2];

if (!userPublicKey) {
    console.log("Please provide a public key as a command-line argument.");
    process.exit(1);
}

// Convert the provided public key to a PublicKey object
const targetPublicKey = new PublicKey(userPublicKey);

// Get the wallet balance for the provided public key
const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        console.log("Connection object is:", connection);

        // Get the balance of the provided public key
        const walletBalance = await connection.getBalance(targetPublicKey);
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Request airdrop of 2 SOL to the provided public key
        console.log(`Airdropping 2 SOL to the wallet with public key: ${targetPublicKey}`);
        const fromAirDropSignature = await connection.requestAirdrop(
            targetPublicKey,
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
    console.log(`Checking balance for public key: ${targetPublicKey}`);
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}

// Execute the main function
mainFunction();
