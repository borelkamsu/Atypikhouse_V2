import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';

// Mapping des types vers des descriptions en français
const TYPE_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  cabin: {
    title: 'Cabanes',
    description: 'Dormez dans les arbres et profitez d\'une vue imprenable sur la nature.'
  },
  yurt: {
    title: 'Yourtes',
    description: 'Expérimentez le confort moderne dans une habitation traditionnelle.'
  },
  floating: {
    title: 'Maisons flottantes',
    description: 'Vivez au rythme de l\'eau dans une habitation unique sur l\'eau.'
  },
  dome: {
    title: 'Dômes',
    description: 'Découvrez le confort moderne dans des structures géodésiques uniques.'
  },
  caravan: {
    title: 'Caravanes',
    description: 'Voyagez dans le temps avec des caravanes vintage rénovées.'
  },
  igloo: {
    title: 'Igloos',
    description: 'Vivez une expérience polaire dans un igloo confortable et chauffé.'
  },
  other: {
    title: 'Autres',
    description: 'Des habitations insolites qui sortent de l\'ordinaire.'
  }
};

// GET /api/properties/categories - Récupérer les catégories d'habitations disponibles
export async function GET() {
  try {
    await dbConnect();

    // Récupérer les types distincts de propriétés disponibles
    const distinctTypes = await Property.distinct('type', { isAvailable: true });

    // Compter le nombre de propriétés par type
    const categoriesWithCount = await Promise.all(
      distinctTypes.map(async (type) => {
        const count = await Property.countDocuments({ type, isAvailable: true });
        return {
          type,
          title: TYPE_DESCRIPTIONS[type]?.title || type,
          description: TYPE_DESCRIPTIONS[type]?.description || '',
          count
        };
      })
    );

    // Trier par nombre de propriétés (décroissant)
    categoriesWithCount.sort((a, b) => b.count - a.count);

    return NextResponse.json({ categories: categoriesWithCount });

  } catch (error: any) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
