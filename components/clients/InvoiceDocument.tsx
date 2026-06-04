'use client'

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { Client, Invoice } from '@/hooks/types/clients-contracts'

const money = (cents: number) => `$${((cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: '#181d27', fontFamily: 'Helvetica' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logo: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#155eef', color: '#fff', fontSize: 16, textAlign: 'center', paddingTop: 5, marginRight: 8 },
  brand: { fontSize: 18, fontFamily: 'Helvetica-Bold' },
  h: { fontSize: 22, fontFamily: 'Helvetica-Bold' },
  muted: { color: '#717680' },
  block: { marginBottom: 16 },
  label: { color: '#717680', fontSize: 9, marginBottom: 3, textTransform: 'uppercase' },
  th: { flexDirection: 'row', backgroundColor: '#fafafa', borderTop: '1 solid #e9eaeb', borderBottom: '1 solid #e9eaeb', paddingVertical: 6, paddingHorizontal: 8, marginTop: 16 },
  td: { flexDirection: 'row', borderBottom: '1 solid #f0f0f0', paddingVertical: 8, paddingHorizontal: 8 },
  cDesc: { flex: 3 },
  cNum: { flex: 1, textAlign: 'right' },
  totals: { marginTop: 16, alignSelf: 'flex-end', width: 240 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  grand: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTop: '1 solid #e9eaeb', marginTop: 4 },
  grandText: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
})

export function InvoiceDocument({
  invoice, client, expertName,
}: {
  invoice: Invoice
  client: Client
  expertName: string
}) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.brandRow}>
          <Text style={s.logo}>p</Text>
          <Text style={s.brand}>proploy</Text>
        </View>

        <View style={[s.row, s.block]}>
          <View>
            <Text style={s.h}>Invoice</Text>
            <Text style={s.muted}>{invoice.number}</Text>
          </View>
          <View>
            <Text>Issued: {invoice.issuedDate}</Text>
            <Text>Due: {invoice.dueDate}</Text>
            <Text style={{ textTransform: 'capitalize' }}>Status: {invoice.status}</Text>
          </View>
        </View>

        <View style={[s.row, s.block]}>
          <View>
            <Text style={s.label}>From</Text>
            <Text>{expertName}</Text>
            <Text style={s.muted}>via Proploy</Text>
          </View>
          <View>
            <Text style={s.label}>Bill to</Text>
            <Text>{client.name}</Text>
            {!!client.contactName && <Text style={s.muted}>{client.contactName}</Text>}
            {!!client.contactEmail && <Text style={s.muted}>{client.contactEmail}</Text>}
          </View>
        </View>

        <View style={s.th}>
          <Text style={s.cDesc}>Description</Text>
          <Text style={s.cNum}>Hours</Text>
          <Text style={s.cNum}>Rate</Text>
          <Text style={s.cNum}>Amount</Text>
        </View>
        {invoice.lineItems.map((li) => (
          <View key={li.id} style={s.td}>
            <Text style={s.cDesc}>{li.description}</Text>
            <Text style={s.cNum}>{li.hours}</Text>
            <Text style={s.cNum}>{money(li.rateCents)}</Text>
            <Text style={s.cNum}>{money(li.amountCents)}</Text>
          </View>
        ))}
        {invoice.lineItems.length === 0 && (
          <View style={s.td}><Text style={s.muted}>No billable time logged.</Text></View>
        )}

        <View style={s.totals}>
          <View style={s.totalRow}><Text style={s.muted}>Subtotal</Text><Text>{money(invoice.subtotalCents)}</Text></View>
          <View style={s.totalRow}><Text style={s.muted}>Platform fee ({invoice.feePct}%)</Text><Text>-{money(invoice.feeCents)}</Text></View>
          <View style={s.grand}><Text style={s.grandText}>Net payout</Text><Text style={s.grandText}>{money(invoice.totalCents)}</Text></View>
        </View>

        {!!invoice.notes && <Text style={[s.muted, { marginTop: 24 }]}>{invoice.notes}</Text>}
      </Page>
    </Document>
  )
}
