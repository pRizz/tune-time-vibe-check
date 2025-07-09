# Chromatic Tuner

A professional-grade chromatic tuner web application that provides real-time pitch detection for any musical instrument.

## ✨ Features

### 🎵 Professional Pitch Detection
- **Real-time frequency analysis** using advanced autocorrelation algorithms
- **30-sample moving average** for stable and accurate readings
- **Exponential smoothing** for smooth frequency display transitions
- **Chromatic note support** covering C2 to B5 (5+ octaves)

### 🎸 Multi-Instrument Support
- **Universal chromatic tuner** works with any instrument
- **Guitar tuning reference** with standard EADGBE tuning
- **Piano reference notes** including A440 and Middle C
- **Comprehensive chromatic scale** display

### 🔧 Advanced Features
- **Smart volume detection** with customizable thresholds
- **Frequency memory** retains last detected note when signal is quiet
- **Visual tuning indicator** shows flat/sharp with precision
- **Cents deviation display** for fine-tuning accuracy
- **"In Tune" detection** with ±5 cent tolerance

### 🎨 Modern UI/UX
- **Dark mode interface** optimized for performance environments
- **Responsive design** works on all devices
- **Smooth animations** and transitions
- **Professional typography** with monospace frequency display
- **Visual volume meter** with real-time feedback

### 🔒 Privacy & Performance
- **Local processing** - no data sent to servers
- **Microphone access** with proper permission handling
- **Optimized audio processing** for minimal latency
- **Browser-based** - no installation required

## 🚀 Quick Start

1. **Allow microphone access** when prompted
2. **Click "Start Tuning"** to begin
3. **Play your instrument** and watch the real-time frequency display
4. **Tune to the target note** using the visual indicator

## 📊 Technical Specifications

- **Frequency Range**: 65 Hz - 988 Hz (C2 to B5)
- **Accuracy**: ±5 cents for "In Tune" detection
- **Sample Rate**: Adaptive based on browser capabilities
- **Response Time**: ~50ms with smoothing
- **Volume Threshold**: 0.04 (adjustable)

**URL**: https://lovable.dev/projects/56f835f2-47d5-454f-97fc-f8b8bfc4c036

**GitHub**: https://github.com/pRizz/tune-time-vibe-check

## Project Info

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/56f835f2-47d5-454f-97fc-f8b8bfc4c036) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/56f835f2-47d5-454f-97fc-f8b8bfc4c036) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
