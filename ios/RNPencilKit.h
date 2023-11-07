#ifndef RNPencilKit_h
#define RNPencilKit_h


#endif /* RNPencilKit_h */

#import <Foundation/Foundation.h>

@interface RNPencilKit : NSObject

+ (RNPencilKit *_Nonnull)sharedInstance;

@property(nullable) NSData* drawingData;

-(void) saveData;
-(void) loadData;

@end
