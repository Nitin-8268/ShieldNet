package com.shieldnet.vpn

import android.util.Log

/**
 * Handles DNS resolution and ad-filtering logic.
 */
class DnsResolver(private val adFilterDatabase: AdFilterDatabase) {

    /**
     * Resolves a domain name. 
     * If the domain is in the ad list, returns 0.0.0.0 (blocked).
     */
    fun resolve(domain: String): String {
        if (adFilterDatabase.isAdDomain(domain)) {
            Log.d("ShieldNet", "Blocking ad domain: $domain")
            return "0.0.0.0"
        }
        
        // Otherwise, forward to secure DNS (like Cloudflare 1.1.1.1)
        return forwardToSecureDns(domain)
    }

    private fun forwardToSecureDns(domain: String): String {
        // Implementation of DNS-over-HTTPS or standard UDP DNS forwarding
        // For project purposes, this would call an upstream resolver.
        return "FORWARDED" 
    }
}

/**
 * Mock database for ad domains. 
 * In a real app, this would use SQLite/Room with millions of hosts.
 */
class AdFilterDatabase {
    private val blockedHosts = setOf(
        "doubleclick.net",
        "google-analytics.com",
        "ads.facebook.com",
        "adservice.google.com"
    )

    fun isAdDomain(domain: String): Boolean {
        return blockedHosts.any { domain.contains(it, ignoreCase = true) }
    }
}
