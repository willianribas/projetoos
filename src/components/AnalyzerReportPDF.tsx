
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { AnalyzerWithStatus } from "@/types/analyzer";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "16.6%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "16.6%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
  statusHeader: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
});

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'in-day':
      return 'Em Dia';
    case 'expiring-soon':
      return 'Vencerá em até 30 dias';
    case 'expired':
      return 'Vencido';
    case 'in-calibration':
      return 'Em Calibração';
    default:
      return 'Desconhecido';
  }
};

interface AnalyzerReportPDFProps {
  analyzers: AnalyzerWithStatus[];
  selectedStatus: string | null;
}

const AnalyzerReportPDF = ({ analyzers, selectedStatus }: AnalyzerReportPDFProps) => {
  const reportTitle = selectedStatus ? 
    `Relatório de Analisadores - ${getStatusDisplay(selectedStatus)}` : 
    "Relatório de Analisadores";
  
  const filteredAnalyzers = selectedStatus ? 
    analyzers.filter(a => a.status === selectedStatus) : 
    analyzers;

  const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{reportTitle}</Text>
        <Text style={styles.subtitle}>Gerado em {today}</Text>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>NS/PT</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Nome</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Marca</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Modelo</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Vencimento</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Status</Text>
            </View>
          </View>
          
          {filteredAnalyzers.map((analyzer, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{analyzer.serial_number}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{analyzer.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{analyzer.brand}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{analyzer.model}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {format(new Date(analyzer.calibration_due_date), 'MMM yyyy', { locale: ptBR })}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{getStatusDisplay(analyzer.status)}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <Text style={styles.footer}>
          © {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
        </Text>
      </Page>
    </Document>
  );
};

export default AnalyzerReportPDF;
