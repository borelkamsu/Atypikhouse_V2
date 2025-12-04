const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function removeUsernameIndex() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atypikhouse';
    
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const db = mongoose.connection.db;
    
    // Essayer sur la base 'test' (d'après l'erreur)
    let usersCollection = db.collection('users');
    
    // Vérifier si la collection existe dans 'test'
    const collections = await db.listCollections().toArray();
    const testDbExists = collections.some(c => c.name === 'users');
    
    if (!testDbExists) {
      // Essayer de récupérer le nom de la base depuis l'URI
      const dbName = MONGODB_URI.split('/').pop()?.split('?')[0] || 'test';
      console.log(`📊 Utilisation de la base: ${dbName}`);
      const adminDb = mongoose.connection.db.admin();
      const dbList = await adminDb.listDatabases();
      
      console.log('\n📋 Bases de données disponibles:');
      dbList.databases.forEach(db => {
        console.log(`  - ${db.name}`);
      });
    }

    // Lister les index actuels
    console.log('\n📋 Index actuels dans la collection users:');
    try {
      const indexes = await usersCollection.listIndexes().toArray();
      indexes.forEach(index => {
        console.log(`  - ${index.name}:`, JSON.stringify(index.key));
      });
    } catch (error) {
      console.log('⚠️ Impossible de lister les index (collection peut-être vide)');
    }

    // Supprimer l'index username_1
    console.log('\n🔄 Tentative de suppression de l\'index username_1...');
    try {
      await usersCollection.dropIndex('username_1');
      console.log('✅ Index username_1 supprimé avec succès');
    } catch (error) {
      if (error.codeName === 'IndexNotFound' || error.message?.includes('index not found')) {
        console.log('ℹ️ L\'index username_1 n\'existe pas (déjà supprimé ou n\'a jamais existé)');
      } else {
        throw error;
      }
    }

    // Lister les index restants pour vérification
    console.log('\n📋 Index restants après suppression:');
    try {
      const indexes = await usersCollection.listIndexes().toArray();
      if (indexes.length === 0) {
        console.log('  (aucun index)');
      } else {
        indexes.forEach(index => {
          console.log(`  - ${index.name}:`, JSON.stringify(index.key));
        });
      }
    } catch (error) {
      console.log('⚠️ Impossible de lister les index');
    }

    await mongoose.connection.close();
    console.log('\n✅ Terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

removeUsernameIndex();

