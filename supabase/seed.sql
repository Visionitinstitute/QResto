-- ==========================================================
-- QResto Demo Seed Data
-- Run this in your Supabase SQL Editor after running schema.sql
-- Note: Replace the owner_id with your real auth.users id or run as service role
-- ==========================================================

DO $$
DECLARE
    dummy_owner_id UUID;
    v_hotel_id UUID;
    cat_starters UUID;
    cat_mains UUID;
    cat_breads UUID;
    cat_drinks UUID;
BEGIN
    -- Select the first existing user in auth.users, or generate a dummy uuid if none exists yet
    SELECT id INTO dummy_owner_id FROM auth.users LIMIT 1;
    IF dummy_owner_id IS NULL THEN
        dummy_owner_id := gen_random_uuid();
    END IF;

    -- 1. Insert Demo Hotel
    INSERT INTO public.hotels (id, owner_id, name, slug, address, phone, is_active)
    VALUES (
        gen_random_uuid(),
        dummy_owner_id,
        'Royal Spice Restaurant & Cafe',
        'demo-hotel',
        '102 MG Road, Connaught Place, New Delhi',
        '+91 98765 43210',
        true
    )
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_hotel_id;

    -- 2. Insert Categories
    INSERT INTO public.categories (id, hotel_id, name, sort_order)
    VALUES (gen_random_uuid(), v_hotel_id, 'Starters & Appetizers', 1)
    RETURNING id INTO cat_starters;

    INSERT INTO public.categories (id, hotel_id, name, sort_order)
    VALUES (gen_random_uuid(), v_hotel_id, 'Main Course', 2)
    RETURNING id INTO cat_mains;

    INSERT INTO public.categories (id, hotel_id, name, sort_order)
    VALUES (gen_random_uuid(), v_hotel_id, 'Breads & Rice', 3)
    RETURNING id INTO cat_breads;

    INSERT INTO public.categories (id, hotel_id, name, sort_order)
    VALUES (gen_random_uuid(), v_hotel_id, 'Beverages & Desserts', 4)
    RETURNING id INTO cat_drinks;

    -- 3. Insert Menu Items (12 items)
    -- Starters
    INSERT INTO public.menu_items (hotel_id, category_id, name, description, price, is_veg, is_available) VALUES
    (v_hotel_id, cat_starters, 'Paneer Tikka', 'Charcoal grilled cottage cheese cubes marinated in spiced yogurt', 260.00, true, true),
    (v_hotel_id, cat_starters, 'Crispy Corn & Pepper', 'Golden fried sweet corn tossed with bell peppers and green chillies', 210.00, true, true),
    (v_hotel_id, cat_starters, 'Chicken Seekh Kebab', 'Minced chicken kebabs skewers infused with aromatic spices', 320.00, false, true);

    -- Mains
    INSERT INTO public.menu_items (hotel_id, category_id, name, description, price, is_veg, is_available) VALUES
    (v_hotel_id, cat_mains, 'Paneer Butter Masala', 'Rich, creamy tomato gravy with tender paneer cubes and butter', 340.00, true, true),
    (v_hotel_id, cat_mains, 'Dal Makhani', 'Slow cooked black lentils with fresh cream and butter', 280.00, true, true),
    (v_hotel_id, cat_mains, 'Butter Chicken Special', 'Tandoori chicken pieces in a silky sweet-savory makhani gravy', 420.00, false, true);

    -- Breads & Rice
    INSERT INTO public.menu_items (hotel_id, category_id, name, description, price, is_veg, is_available) VALUES
    (v_hotel_id, cat_breads, 'Butter Garlic Naan', 'Tandoor baked soft leavened flatbread brushed with garlic and butter', 75.00, true, true),
    (v_hotel_id, cat_breads, 'Tandoori Roti', 'Crisp whole wheat flatbread made in traditional clay oven', 35.00, true, true),
    (v_hotel_id, cat_breads, 'Hyderabadi Dum Biryani', 'Layered basmati rice with exotic spices and herbs served with raita', 350.00, true, true);

    -- Beverages & Desserts
    INSERT INTO public.menu_items (hotel_id, category_id, name, description, price, is_veg, is_available) VALUES
    (v_hotel_id, cat_drinks, 'Virgin Mint Mojito', 'Refreshing blend of fresh mint leaves, lemon juice, soda and crushed ice', 140.00, true, true),
    (v_hotel_id, cat_drinks, 'Gulab Jamun with Ice Cream', 'Warm fried khoya balls soaked in saffron syrup with vanilla ice cream', 130.00, true, true),
    (v_hotel_id, cat_drinks, 'Masala Chai / Filter Coffee', 'Freshly brewed traditional aromatic hot beverage', 60.00, true, true);

    -- 4. Insert 5 Demo Tables
    INSERT INTO public.tables (hotel_id, table_number) VALUES
    (v_hotel_id, 1),
    (v_hotel_id, 2),
    (v_hotel_id, 3),
    (v_hotel_id, 4),
    (v_hotel_id, 5)
    ON CONFLICT (hotel_id, table_number) DO NOTHING;

END $$;
