# Lightning Tip Jar

A simple web application that allows users to leave tips using the Bitcoin Lightning Network.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- Nostr Wallet Connect (via @getalby/sdk) for Lightning Network integration

## Setup

1. Clone the repository

   ```
   git clone https://github.com/ATLBitLab/lntipjar.git
   cd lntipjar
   ```

2. Install dependencies

   ```
   yarn install
   ```

3. Create a `.env.local` file and set your Nostr Wallet Connect URL:

   ```
   NOSTR_WALLET_CONNECT_URL=nostr+walletconnect://<your-connect-url>
   ```

4. Run the development server

   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Nostr Wallet Connect Configuration

This application uses the [GetAlby SDK](https://www.npmjs.com/package/@getalby/sdk) and the Nostr Wallet Connect protocol. Ensure `NOSTR_WALLET_CONNECT_URL` is set in your environment with a valid connect URL from your Nostr wallet or Alby.

[GetAlby SDK Docs](https://www.npmjs.com/package/@getalby/sdk)

## License

[MIT License](LICENSE)

---

⚡ Built by [ATL BitLab](https://atlbitlab.com)
