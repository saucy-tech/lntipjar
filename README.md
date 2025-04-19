# Lightning Tip Jar

A simple web application that allows users to leave tips using the Bitcoin Lightning Network.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- LNBits API for Lightning Network integration

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

3. Create a `.env.local` file with your LNBits credentials
   ```
   LNBITS_INVOICE_READ_KEY=your-invoice-read-key
   LNBITS_URL=https://legend.lnbits.com
   ```

4. Run the development server
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## LNBits Configuration

This application requires a valid LNBits setup to function properly. You must configure your environment variables with valid LNBits API keys for both development and production use.

[LNBits API Docs](https://docs.lnbits.org/)

## License

[MIT License](LICENSE)

---

⚡ Built by [ATL BitLab](https://atlbitlab.com)