import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from './components/ui/button.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card.jsx'
import { Badge } from './components/ui/badge.jsx'
import { Textarea } from './components/ui/textarea.jsx'
import { ShoppingCart, Phone, MessageCircle, Plus, Minus, X, Languages, Image } from 'lucide-react'
import './App.css'

// بيانات وهمية (بدل الـ API)
const categoriesData = [
  { key: 'fish', nameAr: 'أسماك', nameEn: 'Fish' },
  { key: 'shrimp', nameAr: 'جمبري', nameEn: 'Shrimp' },
];

const itemsData = [
  { id: 1, nameAr: 'سمك قاروص', nameEn: 'Sea Bass', price: 50, category: 'fish', image_url: '', descriptionAr: 'طازج', descriptionEn: 'Fresh' },
  { id: 2, nameAr: 'جمبري مشوي', nameEn: 'Grilled Shrimp', price: 70, category: 'shrimp', image_url: '', descriptionAr: 'مشوي', descriptionEn: 'Grilled' },
  { id: 3, nameAr: 'سمك هامور', nameEn: 'Hamour Fish', price: 60, category: 'fish', image_url: '', descriptionAr: 'طازج', descriptionEn: 'Fresh' },
];

// دالة لتنظيم الأصناف حسب القسم
const groupItemsByCategory = (items) => {
  return items.reduce((acc, item) => {
    const categoryKey = item.category;
    if (!acc[categoryKey]) acc[categoryKey] = [];
    acc[categoryKey].push(item);
    return acc;
  }, {});
};

function App() {
  const [language, setLanguage] = useState('ar');
  const [cart, setCart] = useState([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [categories, setCategories] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});
  const [loading, setLoading] = useState(true);

  const texts = {
    ar: {
      title: 'صافي للمأكولات البحرية',
      subtitle: 'منيو إلكتروني تفاعلي',
      cart: 'السلة',
      orderNow: 'اطلب الآن عبر الواتساب',
      directCall: 'اتصال مباشر',
      whatsapp: 'واتساب',
      addToCart: 'أضف للسلة',
      quantity: 'الكمية',
      total: 'الإجمالي',
      sar: 'ريال',
      orderNotes: 'ملاحظات على الطلب (اختياري)',
      clearCart: 'إفراغ السلة',
      contactInfo: 'معلومات الاتصال',
      phones: 'أرقام الهواتف',
      address: 'العنوان',
      addressText: 'مسيمير، الداودية سيتي - بجوار بروة سيتي',
      loadingError: 'فشل في تحميل البيانات',
      emptyCart: 'سلة الطلبات فارغة. ابدأ بإضافة الأصناف!',
      retry: 'إعادة المحاولة',
      loadingMessage: 'جاري التحميل...'
    },
    en: {
      title: 'Safy Seafood Restaurant',
      subtitle: 'Interactive Electronic Menu',
      cart: 'Cart',
      orderNow: 'Order Now via WhatsApp',
      directCall: 'Direct Call',
      whatsapp: 'WhatsApp',
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      total: 'Total',
      sar: 'SAR',
      orderNotes: 'Order Notes (Optional)',
      clearCart: 'Clear Cart',
      contactInfo: 'Contact Information',
      phones: 'Phone Numbers',
      address: 'Address',
      addressText: 'Musaimeer, Al Dawadiya City - Next to Barwa City',
      loadingError: 'Failed to load data',
      emptyCart: 'Your cart is empty. Start adding items!',
      retry: 'Retry',
      loadingMessage: 'Loading...'
    }
  }

  const t = texts[language]

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCategories(categoriesData);
      setGroupedItems(groupItemsByCategory(itemsData));
      setLoading(false);
    }, 800);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prevLang => prevLang === 'ar' ? 'en' : 'ar');
  }, []);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prevCart => prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
    setOrderNotes('');
  };

  const getTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const phoneNumber = '97470498084';
    let message = `${t.title} - ${t.orderNow}:\n\n`;
    cart.forEach(item => {
      const itemName = language === 'ar' ? item.nameAr : item.nameEn;
      message += `• ${itemName} - ${t.quantity}: ${item.quantity} - ${t.total}: ${item.price * item.quantity} ${t.sar}\n`;
    });
    message += `\n${t.total}: ${getTotalPrice} ${t.sar}`;
    if (orderNotes.trim()) {
      message += `\n${t.orderNotes}: ${orderNotes}`;
    }
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const makeDirectCall = () => {
    window.open('tel:+97450326896', '_self');
  };

  const getItemsByCategory = useCallback((categoryKey) => {
    return groupedItems[categoryKey] || [];
  }, [groupedItems]);

  const MenuImage = ({ item, language }) => {
    const [imgError, setImgError] = useState(false);
    useEffect(() => { setImgError(false); }, [item.id]);
    const altText = language === 'ar' ? item.nameAr : item.nameEn;
    if (!item.image_url || imgError) {
      return (
        <div className="aspect-video w-full flex items-center justify-center bg-gray-200 text-gray-500 rounded-t-lg">
          <Image className="w-8 h-8" />
        </div>
      );
    }
    return (
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={item.image_url}
          alt={altText}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">{t.loadingMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              🌊 {t.title}
            </h1>
            <p className="text-blue-100 mt-1">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Languages className="w-4 h-4 mr-1" />
              {language === 'ar' ? 'EN' : 'عر'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 relative"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {t.cart}
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs defaultValue={categories[0]?.key} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 h-auto p-1 sticky top-20 bg-white/90 backdrop-blur-sm z-10 border-b">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.key}
                    value={category.key}
                    className="text-xs p-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    {language === 'ar' ? category.nameAr : category.nameEn}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((category) => (
                <TabsContent key={category.key} value={category.key} className="mt-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {language === 'ar' ? category.nameAr : category.nameEn}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getItemsByCategory(category.key).map((item) => {
                      const itemDescription = language === 'ar' ? item.descriptionAr : item.descriptionEn;
                      return (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                          <MenuImage item={item} language={language} />
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              {language === 'ar' ? item.nameAr : item.nameEn}
                            </CardTitle>
                            {itemDescription && (
                              <CardDescription className="text-sm text-gray-600">
                                {itemDescription}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardFooter className="flex justify-between items-center pt-2">
                            <span className="text-xl font-bold text-blue-600">
                              {item.price} {t.sar}
                            </span>
                            <Button
                              onClick={() => addToCart(item)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              {t.addToCart}
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t.cart}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">{t.emptyCart}</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {language === 'ar' ? item.nameAr : item.nameEn}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {item.price} {t.sar} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>{t.total}:</span>
                        <span className="text-blue-600">{getTotalPrice} {t.sar}</span>
                      </div>
                    </div>
                    <Textarea
                      placeholder={t.orderNotes}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="mt-3"
                      rows={3}
                    />
                    <div className="space-y-2 mt-4">
                      <Button
                        onClick={sendWhatsAppOrder}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={cart.length === 0}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t.orderNow}
                      </Button>
                      <Button
                        onClick={clearCart}
                        variant="outline"
                        className="w-full"
                        disabled={cart.length === 0}
                      >
                        {t.clearCart}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">{t.contactInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">{t.phones}:</h4>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={makeDirectCall}
                        className="bg-blue-600 hover:bg-blue-700 flex-1"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        {t.directCall}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => window.open('https://wa.me/97470498084', '_blank')}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {t.whatsapp}
                      </Button>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>44871517 - 70498084 - 50326896</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{t.address}:</h4>
                  <p className="text-xs text-gray-600">{t.addressText}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
