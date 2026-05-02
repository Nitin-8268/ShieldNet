package com.shieldnet.tests

import com.shieldnet.vpn.PacketAnalyzer
import java.nio.ByteBuffer
import org.junit.Assert.assertTrue
import org.junit.Assert.assertFalse
import org.junit.Test

/**
 * Unit tests for PacketAnalyzer.
 * Verifies that suspicious ad-tracking patterns are correctly identified.
 */
class PacketAnalyzerTest {

    private val analyzer = PacketAnalyzer()

    @Test
    fun testStandardPacketIsNotSuspicious() {
        // Standard payload, length 1000
        val buffer = ByteBuffer.allocate(16384)
        buffer.put(0, 0x45) // IPv4
        buffer.put(9, 6)    // TCP
        
        val isSuspicious = analyzer.isSuspicious(buffer, 1000)
        assertFalse("Standard TCP packet should not be suspicious", isSuspicious)
    }

    @Test
    fun testTrackingBurstIsSuspicious() {
        // UDP packet to port 8888, length 60
        val buffer = ByteBuffer.allocate(16384)
        buffer.put(0, 0x45) // IPv4
        buffer.put(9, 17)   // UDP
        buffer.put(22, 0x22) // Port high byte
        buffer.put(23, 0xB8.toByte()) // Port low byte (8888)
        
        val isSuspicious = analyzer.isSuspicious(buffer, 60)
        assertTrue("Telemetry UDP burst should be suspicious", isSuspicious)
    }
}
