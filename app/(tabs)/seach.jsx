import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { MealAPI } from "../../services/mealAPI";
import { searchStyles } from "../../assets/styles/search.styles";
import { useDebounce } from "../../hooks/useDebounce";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const debounceSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = async (query) => {
    if (!query?.trim()) {
      const randomMeals = await MealAPI.getRandomMeals(12);
      return randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
    }
    const nameResults = await MealAPI.searchMealsByName(query);
    let results = nameResults || [];

    if (results.length === 0) {
      const ingredientResults = await MealAPI.filterByIngredient(query);
      results = ingredientResults || [];
    }
    return results
      .slice(0, 12)
      .map((meal) => MealAPI.transformMealData(meal))
      .filter((meal) => meal !== null);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const results = await performSearch();
        setRecipes(results);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (initialLoading) return;

    const handleSearch = async () => {
      setLoading(true);
      try {
        const results = await performSearch(debounceSearchQuery);
        setRecipes(results);
      } catch (error) {
        console.error("Error performing search:", error);
      } finally {
        setLoading(false);
      }
    };
    handleSearch();
  }, [debounceSearchQuery, initialLoading]);

  if (initialLoading) {
    return (
      <View>
        <Text>Loading some data...</Text>
      </View>
    );
  }

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searchIcon}
          />
        </View>
      </View>
    </View>
  );
};

export default SearchScreen;
