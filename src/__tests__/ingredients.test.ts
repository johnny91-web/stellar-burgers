import reducer from '../services/slices/ingredientsSlice';
import { fetchIngredients } from '../services/slices/ingredientsSlice';
import type { TIngredient } from '../utils/types';


// Фабрика для создания валидного TIngredient
function makeIngredient(
  _id: string,
  name: string,
  type: string,
  price: number
): TIngredient {
  return {
    _id,
    name,
    type,
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 300,
    price,
    image: 'https://example.com/image.png',
    image_large: 'https://example.com/image_large.png',
    image_mobile: 'https://example.com/image_mobile.png'
  };
}

describe('ingredientsSlice reducer', () => {
  test('should return initial state when state is undefined and action is unknown', () => {
    const result = reducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('should handle fetchIngredients.pending', () => {
    const initialState = {
      ingredients: [] as TIngredient[],
      isLoading: false,
      error: 'some error' as string | null,
    };

    const action = fetchIngredients.pending('', undefined);
    const result = reducer(initialState, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  test('should handle fetchIngredients.fulfilled with payload', () => {
    // Используем фабричную функцию для создания полных объектов TIngredient
    const mockIngredients: TIngredient[] = [
      makeIngredient('1', 'Ingredient 1', 'bun', 100),
      makeIngredient('2', 'Ingredient 2', 'sauce', 50)
    ];

    const initialState = {
      ingredients: [] as TIngredient[],
      isLoading: true,
      error: null,
    };
    const action = fetchIngredients.fulfilled(mockIngredients, '', undefined);
    const result = reducer(initialState, action);

    expect(result).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null,
    });
  });

  test('should handle fetchIngredients.rejected with error message', () => {
    const initialState = {
      ingredients: [] as TIngredient[],
      isLoading: true,
      error: null,
    };

    const action = fetchIngredients.rejected(new Error('Network error'), '', undefined);
    const result = reducer(initialState, action);


    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Network error',
    });
  });
});
