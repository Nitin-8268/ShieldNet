# ShieldNet: Professional Ad-Blocking VPN Architecture (V3.0)

This document outlines the professional architecture for the ShieldNet Android application using Kotlin.

## 1. Core Services

### VpnService (VpnModule)
The engine of the app. It creates a Virtual Network Interface (TUN) and captures all device traffic.
- **Local DNS Forwarder**: Proxies DNS requests to an ad-filtering server or local database.
- **Traffic Routing**: Implements Tor-like multi-hop routing using an Onion Routing library.
- **Packet Filtering**: Inspects IP packets for known ad-serving domains and IP ranges.

### Ad-Blocking Engine
- **Filter Lists**: Uses EasyList, AdAway, and custom host-based lists.
- **DNS-over-HTTPS (DoH)**: Encrypts DNS queries to prevent ISP snooping.
- **Heuristic Analysis**: Detects ad patterns in traffic behavior.

## 2. Professional Project Structure (Android/Kotlin)

```text
app/
├── src/main/java/com/shieldnet/
│   ├── vpn/
│   │   ├── ShieldVpnService.kt      # Core VPN implementation
│   │   ├── PacketAnalyzer.kt        # Heuristic packet inspection
│   │   └── DnsResolver.kt           # Ad-filtering DNS logic
│   ├── ui/
│   │   ├── dashboard/               # Dashboard screens
│   │   ├── settings/                # Configuration UI
│   │   └── common/                  # Reusable UI components
│   ├── network/
│   │   ├── TorManager.kt             # Tor service integration
│   │   └── FilterManager.kt          # Manages dynamic ad-lists
│   ├── data/
│   │   ├── repository/              # Data abstraction layer
│   │   └── db/                      # Room/SQLite schemas
│   └── di/                          # Dependency Injection (Hilt/Koin)
├── src/test/java/com/shieldnet/      # Unit tests
└── src/androidTest/java/com/shieldnet/ # Instrumental UI tests
```

## 3. Testing Strategy
- **Unit Testing (JUnit 5 + Mockk)**: Test DNS resolution logic and filter matching algorithms.
- **Integration Testing**: Test interactions between the VPN service and the Tor manager.
- **UI Testing (Espresso + Compose Test Rule)**: Verify protection toggles and dashboard updates.

## 4. How it works
1. User toggles "Protect Me".
2. `ShieldVpnService` starts, creates a TUN interface.
3. System routes all traffic through the TUN.
4. `DnsResolver` intercepts port 53. If a domain is in `AdFilterDatabase`, it returns `0.0.0.0` (blocked).
5. Data packets are forwarded through the Tor circuit for anonymity.
