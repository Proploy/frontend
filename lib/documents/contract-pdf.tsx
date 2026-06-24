'use client'

import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { Contract, ContractParty, ContractSignature } from '@/hooks/types/contracts-doc'
import { contractTotalCents, dateTime, longDate, money } from './contract-format'

const s = StyleSheet.create({
  page: { padding: 48, fontSize: 10, color: '#181d27', fontFamily: 'Helvetica', lineHeight: 1.5 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logo: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#155eef', color: '#fff', fontSize: 16, textAlign: 'center', paddingTop: 5, marginRight: 8 },
  brand: { fontSize: 18, fontFamily: 'Helvetica-Bold' },
  h1: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  meta: { color: '#717680', marginBottom: 20 },
  sectionLabel: { color: '#717680', fontSize: 9, marginBottom: 6, marginTop: 18, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  partyRow: { flexDirection: 'row', justifyContent: 'space-between' },
  partyCol: { width: '47%' },
  partyName: { fontFamily: 'Helvetica-Bold' },
  muted: { color: '#717680' },
  scope: { color: '#414651' },
  th: { flexDirection: 'row', backgroundColor: '#fafafa', borderTop: '1 solid #e9eaeb', borderBottom: '1 solid #e9eaeb', paddingVertical: 6, paddingHorizontal: 8, marginTop: 8 },
  td: { flexDirection: 'row', borderBottom: '1 solid #f0f0f0', paddingVertical: 8, paddingHorizontal: 8 },
  cLabel: { flex: 3 },
  cDue: { flex: 2 },
  cAmt: { flex: 1.4, textAlign: 'right' },
  grand: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 8, borderTop: '1 solid #e9eaeb', marginTop: 2 },
  grandText: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  sigBox: { width: '47%' },
  sigImg: { height: 48, marginBottom: 4, objectFit: 'contain' },
  sigPending: { height: 48, marginBottom: 4, borderBottom: '1 solid #d5d7da', color: '#717680', paddingTop: 30, fontSize: 9 },
  sigLine: { borderTop: '1 solid #181d27', paddingTop: 4 },
  sigName: { fontFamily: 'Helvetica-Bold' },
  foot: { position: 'absolute', bottom: 28, left: 48, right: 48, fontSize: 8, color: '#717680', borderTop: '1 solid #e9eaeb', paddingTop: 8 },
})

function PartyBlock({ party }: { party: ContractParty }) {
  return (
    <View style={s.partyCol}>
      <Text style={s.partyName}>{party.org}</Text>
      <Text>{party.name}</Text>
      <Text style={s.muted}>{party.email}</Text>
    </View>
  )
}

function SignatureBlock({ party, sig }: { party: ContractParty; sig?: ContractSignature }) {
  return (
    <View style={s.sigBox}>
      {sig ? (
        <Image style={s.sigImg} src={sig.dataUrl} />
      ) : (
        <Text style={s.sigPending}>Awaiting signature</Text>
      )}
      <View style={s.sigLine}>
        <Text style={s.sigName}>{sig?.signedName || party.name}</Text>
        <Text style={s.muted}>{party.org}</Text>
        {sig && <Text style={s.muted}>Signed {dateTime(sig.signedAt)}</Text>}
      </View>
    </View>
  )
}

export function ContractDocument({ contract }: { contract: Contract }) {
  const total = contractTotalCents(contract)
  return (
    <Document title={contract.title}>
      <Page size="A4" style={s.page}>
        <View style={s.brandRow}>
          <Text style={s.logo}>p</Text>
          <Text style={s.brand}>proploy</Text>
        </View>

        <Text style={s.h1}>{contract.title}</Text>
        <Text style={s.meta}>
          {contract.project} · Created {longDate(contract.createdAt)}
        </Text>

        <Text style={s.sectionLabel}>Parties</Text>
        <View style={s.partyRow}>
          <PartyBlock party={contract.provider} />
          <PartyBlock party={contract.client} />
        </View>

        <Text style={s.sectionLabel}>Scope of work</Text>
        <Text style={s.scope}>{contract.scope}</Text>
        {contract.uploadedDocName ? (
          <Text style={[s.muted, { marginTop: 6 }]}>Attached source document: {contract.uploadedDocName}</Text>
        ) : null}

        <Text style={s.sectionLabel}>Payment schedule</Text>
        <View style={s.th}>
          <Text style={s.cLabel}>Milestone</Text>
          <Text style={s.cDue}>Due</Text>
          <Text style={s.cAmt}>Amount</Text>
        </View>
        {contract.milestones.map((m) => (
          <View key={m.id} style={s.td}>
            <Text style={s.cLabel}>{m.label}</Text>
            <Text style={s.cDue}>{longDate(m.due)}</Text>
            <Text style={s.cAmt}>{money(m.amountCents, contract.currency)}</Text>
          </View>
        ))}
        <View style={s.grand}>
          <Text style={s.grandText}>Total contract value</Text>
          <Text style={s.grandText}>{money(total, contract.currency)}</Text>
        </View>

        <Text style={s.sectionLabel}>Signatures</Text>
        <View style={s.sigRow}>
          <SignatureBlock party={contract.provider} sig={contract.signatures.provider} />
          <SignatureBlock party={contract.client} sig={contract.signatures.client} />
        </View>

        <Text style={s.foot} fixed>
          Executed via Proploy · Signed copies are stored and timestamped for both parties · {contract.title}
        </Text>
      </Page>
    </Document>
  )
}
