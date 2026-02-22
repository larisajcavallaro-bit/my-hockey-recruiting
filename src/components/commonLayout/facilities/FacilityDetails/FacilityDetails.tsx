import Image from "next/image";
import { Star, Phone, Clock, ThumbsUp } from "lucide-react"; // Added ThumbsUp
import { LocationLink } from "@/components/ui/LocationLink";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Recommended UI components
import WriteReviewModal from "@/components/commonLayout/facilities/modal/WriteReviewModal";
import Link from "next/link";

const facility = {
  name: "Arctic Ice Arena",
  rating: 4.8,
  reviewCount: 312,
  address: "12000 Portland Ave S, Minneapolis, MN 55337, USA",
  phone: "(612) 555-0123",
  hours: "Mon–Sun · 6:00 AM – 11:00 PM",
  image: "/newasset/facilities/card/arctic-arena-1.png",
  description:
    "Premier ice skating facility featuring two NHL-sized rinks, perfect for hockey leagues, figure skating, and public skating.",
  amenities: [
    "Ice Rink",
    "Locker Rooms",
    "Cafe / Snack Bar",
    "Parking",
    "Viewing Area",
  ],
  // Updated reviews based on your image
  reviews: [
    {
      id: 1,
      name: "Sarah M.",
      image: "/path-to-avatar.png",
      rating: 5,
      date: "about 2 years ago",
      comment:
        "Absolutely love this place! The ice quality is always perfect, and the staff is incredibly friendly. My kids have been taking lessons here for 2 years and have improved so much.",
      helpfulCount: 12,
    },
    {
      id: 2,
      name: "Michael R.",
      image: "/path-to-avatar.png",
      rating: 5,
      date: "about 2 years ago",
      comment:
        "Great facility overall. The locker rooms are clean and well-maintained. Only minor issue is parking can get crowded during peak hours.",
      helpfulCount: 8,
    },
    {
      id: 3,
      name: "Jennifer L.",
      image: "/path-to-avatar.png",
      rating: 5,
      date: "about 2 years ago",
      comment:
        "Best ice rink in the Twin Cities! The viewing area is perfect for parents. and the café has surprisingly good coffee.",
      helpfulCount: 15,
    },
  ],
};

export default function FacilityDetails() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
      {/* Back */}
      <Link
        href="/facilities"
        className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
      >
        ← Back to all facilities
      </Link>

      {/* Hero Image Section (Unchanged) */}
      <div className="relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden mb-8">
        <Image
          src={facility.image}
          alt={facility.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex items-end p-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{facility.name}</h1>
            <div className="flex items-center gap-2 text-white text-sm mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {facility.rating}
              <span className="opacity-80">
                ({facility.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* About & Amenities (Unchanged) */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-2">
                About This Facility
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {facility.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {facility.amenities.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* REVIEWS SECTION - UPDATED */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl">Reviews</h3>
                <WriteReviewModal />
              </div>

              <div className="space-y-8">
                {facility.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-t pt-6 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.image} />
                          <AvatarFallback>{review.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm">{review.name}</p>
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>

                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Helpful Reaction */}
                    <button className="flex items-center gap-2 mt-4 text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Helpful ({review.helpfulCount})
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR (Unchanged) */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Contact & Address</h3>
              <div className="flex items-start gap-3 text-sm">
                <LocationLink address={facility.address} />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {facility.phone}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {facility.hours}
              </div>
              <Button asChild className="w-full mt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">Overall Rating</p>
              <p className="text-4xl font-bold mt-1">{facility.rating}</p>
              <div className="flex justify-center gap-1 text-amber-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {facility.reviewCount} reviews
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
