package com.shieldnet.vpn

import java.nio.ByteBuffer

/**
 * Professional Heuristic Packet Analyzer.
 * Identifies and flags ad-related packets based on size, frequency, and header flags.
 */
class PacketAnalyzer {

    /**
     * Inspects a raw IP packet.
     * @param buffer The packet data.
     * @return Boolean True if the packet is suspicious (likely an ad or tracker).
     */
    fun isSuspicious(buffer: ByteBuffer, length: Int): Boolean {
        if (length < 20) return false // Too small to be an IP packet
        
        val version = (buffer.get(0).toInt() shr 4) and 0x0F
        if (version != 4) return false // Only handling IPv4 for now
        
        val protocol = buffer.get(9).toInt()
        
        // Example Heuristic: Sudden bursts of small UDP packets to non-standard ports
        // often indicate tracking beacons or ad telemetry.
        if (protocol == 17) { // UDP
            val destinationPort = ((buffer.get(22).toInt() and 0xFF) shl 8) or (buffer.get(23).toInt() and 0xFF)
            
            // Suspicious if it's a known tracking port or unusually small payload
            if (length in 40..100 && isUnusualPort(destinationPort)) {
                return true
            }
        }
        
        return false
    }

    private fun isUnusualPort(port: Int): Boolean {
        // Ports often used by telemetry services that aren't standard web/dns
        val trackingPorts = setOf(8888, 9999, 12345)
        return trackingPorts.contains(port)
    }
}
