import { View, Text, FlatList, StyleSheet } from "react-native";
import ProductCard from "../components/ProductCard";

const products = [
    { id: "1", name: "Laptop", price: "$1000" },
    { id: "2", name: "Phone", price: "$500" },
    { id: "3", name: "Headphones", price: "$150" },
];

export default function ProductsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Available Products</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProductCard product={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});
  Cart.js
