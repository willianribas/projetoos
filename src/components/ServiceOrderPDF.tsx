import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ServiceOrder } from "@/types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
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
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
});

interface ServiceOrderPDFProps {
  serviceOrders: ServiceOrder[];
}

const ServiceOrderPDF = ({ serviceOrders }: ServiceOrderPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Relatório de Ordens de Serviço</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Número OS</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Patrimônio</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Equipamento</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Status</Text>
          </View>
        </View>
        {serviceOrders.map((order, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{order.numeroOS}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{order.patrimonio}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{order.equipamento}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{order.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ServiceOrderPDF;