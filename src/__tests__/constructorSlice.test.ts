import reducer from '../services/slices/constructorSlice';
import {
  addConstructorItems,
  removeConstructorItems,
  removeConstructorItemsAll,
  moveUpConstructorItems,
  moveDownConstructorItems,
  IConstructorState
} from '../services/slices/constructorSlice';
import type { TIngredient, TConstructorIngredient,  } from '@utils-types';


// Фабрика для создания валидного TIngredient под твои типы
function makeIngredient(
  type: 'bun' | 'sauce' | 'ingredient',
  name: string,
  price: number
): TIngredient {
  return {
    _id: Math.random().toString(36).substr(2, 8),
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

function createConstructorState(
  overrides: Partial<IConstructorState> = {}
): IConstructorState {
  return {
    bun: null,
    constructorItems: [],
    maxId: 0,
    ...overrides
  };
}

describe('constructorSlice reducer', () => {
  test('should return initial state when state is undefined and action is unknown', () => {
    const result = reducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({
      bun: null,
      constructorItems: [],
      maxId: 0
    });
  });

  test('should handle addConstructorItems: add bun (type === "bun")', () => {
    const bun = makeIngredient('bun', 'Bun Classic', 100) as TConstructorIngredient;
    const initialState = createConstructorState();

    const action = addConstructorItems(bun);
    const result = reducer(initialState, action);


    // Проверяем, что булка попала в поле bun
    expect(result.bun).toBeDefined();
    expect(result.bun!.name).toBe('Bun Classic');
    expect(result.bun!.type).toBe('bun');

    // Конструктор не должен содержать булку в списке
    expect(result.constructorItems).toHaveLength(0);


    // Важно: prepare добавил id через nanoid
    expect(result.bun!.id).toBeDefined();
  });

  test('should handle addConstructorItems: add ingredient (type !== "bun")', () => {
    const ingredient = makeIngredient('ingredient', 'Cheese', 50) as TConstructorIngredient;
    const initialState = createConstructorState();

    const action = addConstructorItems(ingredient);
    const result = reducer(initialState, action);

    expect(result.bun).toBeNull();
    expect(result.constructorItems).toHaveLength(1);
    expect(result.constructorItems[0].name).toBe('Cheese');
    expect(result.constructorItems[0].type).toBe('ingredient');
    expect(result.constructorItems[0].id).toBeDefined(); // id добавлен prepare
  });

  test('should handle removeConstructorItems by id', () => {
    const item1 = makeIngredient('ingredient', 'Item 1', 10) as TConstructorIngredient;
    const item2 = makeIngredient('ingredient', 'Item 2', 20) as TConstructorIngredient;

    let state = createConstructorState();
    state = reducer(state, addConstructorItems(item1));
    state = reducer(state, addConstructorItems(item2));

    const idToRemove = state.constructorItems[0].id!;
    const action = removeConstructorItems(idToRemove);
    const result = reducer(state, action);

    expect(result.constructorItems).toHaveLength(1);
    expect(result.constructorItems[0].name).toBe('Item 2');
  });

  test('should handle removeConstructorItemsAll', () => {
    const item = makeIngredient('ingredient', 'Item', 10) as TConstructorIngredient;
    const bun = makeIngredient('bun', 'Bun', 100) as TConstructorIngredient;

    let state = createConstructorState();
    state = reducer(state, addConstructorItems(item));
    state = reducer(state, addConstructorItems(bun));

    const action = removeConstructorItemsAll();
    const result = reducer(state, action);

    expect(result.bun).toBeNull();
    expect(result.constructorItems).toHaveLength(0);
  });

  test('should handle moveUpConstructorItems', () => {
    const item1 = makeIngredient('ingredient', 'Item 1', 10) as TConstructorIngredient;
    const item2 = makeIngredient('ingredient', 'Item 2', 20) as TConstructorIngredient;
    const item3 = makeIngredient('ingredient', 'Item 3', 30) as TConstructorIngredient;

    let state = createConstructorState();
    state = reducer(state, addConstructorItems(item1));
    state = reducer(state, addConstructorItems(item2));
    state = reducer(state, addConstructorItems(item3));

    const idToMove = state.constructorItems[1].id!; // Item 2
    const action = moveUpConstructorItems(idToMove);
    const result = reducer(state, action);

    expect(result.constructorItems.map(i => i.name)).toEqual([
      'Item 2',
      'Item 1',
      'Item 3'
    ]);
  });

  test('should handle moveDownConstructorItems', () => {
    const item1 = makeIngredient('ingredient', 'Item 1', 10) as TConstructorIngredient;
    const item2 = makeIngredient('ingredient', 'Item 2', 20) as TConstructorIngredient;
    const item3 = makeIngredient('ingredient', 'Item 3', 30) as TConstructorIngredient;

    let state = createConstructorState();
    state = reducer(state, addConstructorItems(item1));
    state = reducer(state, addConstructorItems(item2));
    state = reducer(state, addConstructorItems(item3));

    const idToMove = state.constructorItems[1].id!; // Item 2
    const action = moveDownConstructorItems(idToMove);
    const result = reducer(state, action);

    expect(result.constructorItems.map(i => i.name)).toEqual([
      'Item 1',
      'Item 3',
      'Item 2'
    ]);
  });
});
