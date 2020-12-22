import _ from "lodash";

interface Food {
  ingredients: string[];
  allergens: string[];
}

interface AllergenCandidates {
  [allergen: string]: string[];
}

export function part1(input: string[]): number {
  const foodList: Food[] = _(input)
    .map((line) => _.replace(line, /\)$/, ""))
    .map((line) => _.split(line, " (contains "))
    .map(([ingredients, allergens]) => {
      return {
        ingredients: _.split(ingredients, " "),
        allergens: _.split(allergens, ", "),
      };
    })
    .value();

  const allergenCandidates = {} as AllergenCandidates;

  _.forEach(foodList, ({ ingredients, allergens }) => {
    for (const allergen of allergens) {
      if (allergenCandidates[allergen]) {
        const newList = _.intersection(
          allergenCandidates[allergen],
          ingredients
        );
        allergenCandidates[allergen] = newList;
      } else {
        allergenCandidates[allergen] = ingredients;
      }
    }
  });

  const hasAllergens = _(allergenCandidates).values().flatten().uniq().value();

  const ingredients = _(foodList).flatMap("ingredients").countBy().value();

  const nonAllergens = _(ingredients)
    .pickBy((count, ingredient) => !_.includes(hasAllergens, ingredient))
    .values()
    .sum();

  return nonAllergens;
}

export function part2(input: string[]): string {
  const foodList: Food[] = _(input)
    .map((line) => _.replace(line, /\)$/, ""))
    .map((line) => _.split(line, " (contains "))
    .map(([ingredients, allergens]) => {
      return {
        ingredients: _.split(ingredients, " "),
        allergens: _.split(allergens, ", "),
      };
    })
    .value();

  let allergenCandidates = {} as AllergenCandidates;

  _.forEach(foodList, ({ ingredients, allergens }) => {
    for (const allergen of allergens) {
      if (allergenCandidates[allergen]) {
        const newList = _.intersection(
          allergenCandidates[allergen],
          ingredients
        );
        allergenCandidates[allergen] = newList;
      } else {
        allergenCandidates[allergen] = ingredients;
      }
    }
  });

  let allergenList: { [allergen: string]: string } = {};

  while (!_.isEmpty(allergenCandidates)) {
    const known = (_(allergenCandidates)
      .pickBy((i) => _.size(i) === 1)
      .mapValues(([v]: [string]) => v)
      // TODO: lodash chain map types are wrong
      .value() as unknown) as { [p: string]: string };

    if (_.isEmpty(known)) {
      console.error("Nope");
      break;
    }

    allergenList = { ...allergenList, ...known };

    allergenCandidates = _(allergenCandidates)
      .mapValues((ingredients) => _.difference(ingredients, _.values(known)))
      .pickBy((ingredients) => !_.isEmpty(ingredients))
      .value() as AllergenCandidates;
  }

  return _(allergenList)
    .map((ingredient, allergen) => ({ ingredient, allergen }))
    .sortBy("allergen")
    .map("ingredient")
    .join(",");
}
