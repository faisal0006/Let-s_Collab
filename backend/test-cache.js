// Test script to verify Redis caching implementation
const { initRedis, cache } = require('./config/redis');

async function testCache() {
  console.log('🧪 Testing Redis Cache Implementation...\n');

  try {
    // Initialize Redis
    await initRedis();
    console.log('✅ Redis initialized\n');

    // Test 1: Set and Get
    console.log('Test 1: Set and Get');
    await cache.set('test:user:123', { id: 123, name: 'John Doe' }, 60);
    console.log('📝 Set: test:user:123 = { id: 123, name: "John Doe" }');
    
    const data = await cache.get('test:user:123');
    console.log('📖 Get: test:user:123 =', data);
    console.log(data && data.id === 123 ? '✅ PASS\n' : '❌ FAIL\n');

    // Test 2: Cache expiry
    console.log('Test 2: TTL (Time To Live)');
    await cache.set('test:temp', { value: 'temporary' }, 2);
    console.log('📝 Set: test:temp with 2s TTL');
    
    const tempData = await cache.get('test:temp');
    console.log('📖 Get immediately:', tempData);
    console.log(tempData ? '✅ PASS (data exists)' : '❌ FAIL');
    
    console.log('⏳ Waiting 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const expiredData = await cache.get('test:temp');
    console.log('📖 Get after expiry:', expiredData);
    console.log(expiredData === null ? '✅ PASS (data expired)\n' : '❌ FAIL\n');

    // Test 3: Delete
    console.log('Test 3: Delete');
    await cache.set('test:delete', { value: 'delete me' }, 60);
    console.log('📝 Set: test:delete');
    
    await cache.del('test:delete');
    console.log('🗑️  Deleted: test:delete');
    
    const deletedData = await cache.get('test:delete');
    console.log('📖 Get after delete:', deletedData);
    console.log(deletedData === null ? '✅ PASS\n' : '❌ FAIL\n');

    // Test 4: Pattern Delete
    console.log('Test 4: Pattern Delete');
    await cache.set('board:id:1', { title: 'Board 1' }, 60);
    await cache.set('board:id:2', { title: 'Board 2' }, 60);
    await cache.set('board:id:3', { title: 'Board 3' }, 60);
    console.log('📝 Set: board:id:1, board:id:2, board:id:3');
    
    await cache.delPattern('board:id:*');
    console.log('🗑️  Deleted pattern: board:id:*');
    
    const board1 = await cache.get('board:id:1');
    const board2 = await cache.get('board:id:2');
    console.log('📖 Get board:id:1:', board1);
    console.log('📖 Get board:id:2:', board2);
    console.log(board1 === null && board2 === null ? '✅ PASS\n' : '❌ FAIL\n');

    // Test 5: Complex data structures
    console.log('Test 5: Complex Data Structures');
    const complexData = {
      id: 1,
      title: 'Whiteboard Project',
      owner: { id: 123, username: 'john' },
      collaborators: [
        { id: 456, username: 'jane' },
        { id: 789, username: 'bob' }
      ],
      elements: [
        { id: 'rect1', type: 'rectangle', x: 100, y: 100 }
      ],
      metadata: {
        created: new Date().toISOString(),
        views: 42
      }
    };
    
    await cache.set('board:complex:1', complexData, 60);
    console.log('📝 Set complex whiteboard data');
    
    const retrieved = await cache.get('board:complex:1');
    console.log('📖 Retrieved:', retrieved);
    console.log(
      retrieved && 
      retrieved.title === complexData.title && 
      retrieved.collaborators.length === 2 &&
      retrieved.elements.length === 1
        ? '✅ PASS\n' 
        : '❌ FAIL\n'
    );

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await cache.delPattern('test:*');
    await cache.delPattern('board:complex:*');
    
    console.log('✅ All tests completed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testCache();
