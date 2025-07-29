import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testItems } from '@/lib/db/schema';

// GET - Get all test items
export async function GET() {
  try {
    const items = await db.select().from(testItems).orderBy(testItems.createdAt);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Get test items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test items' },
      { status: 500 }
    );
  }
}

// POST - Create a new test item
export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const [newItem] = await db.insert(testItems).values({
      name,
      description: description || null,
    }).returning();

    return NextResponse.json({ 
      message: 'Test item created successfully',
      item: newItem 
    });
  } catch (error) {
    console.error('Create test item error:', error);
    return NextResponse.json(
      { error: 'Failed to create test item' },
      { status: 500 }
    );
  }
} 