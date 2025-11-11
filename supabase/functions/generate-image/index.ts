// AI Fusion Design Support Functions
function getColorMaterialDescription(level: string): string {
    const descriptions = {
        'none': 'Maintain original color and material without changes',
        'slight': 'Adopt reference image main colors or subtle texture patterns',
        'medium': 'Balance fusion of colors and material characteristics from both',
        'strong': 'Primarily adopt reference image color scheme and material texture',
        'complete': 'Completely adopt reference image color and material system'
    };
    return descriptions[level as keyof typeof descriptions] || descriptions.medium;
}

function getFormStructureDescription(level: string): string {
    const descriptions = {
        'none': 'Maintain original form and structure without changes',
        'contour': 'Only adopt reference image overall contour and shape',
        'proportion': 'Fusion of reference image size ratios and golden section',
        'structure': 'Deep integration of structural elements and component layout',
        'complete': 'Basic adoption of reference image form and structural framework'
    };
    return descriptions[level as keyof typeof descriptions] || descriptions.proportion;
}

function getDesignStyleDescription(style: string): string {
    const descriptions = {
        'minimal': 'Clean lines, reduced decoration, functionality first',
        'vintage': 'Classic elements, nostalgic texture, traditional craftsmanship feel',
        'tech': 'Futuristic feel, luminous elements, high-tech materials',
        'organic': 'Streamlined, natural forms, biomimetic design',
        'luxury': 'Fine details, noble materials, decorative elements',
        'industrial': 'Exposed structure, functionalism, mechanical aesthetics'
    };
    return descriptions[style as keyof typeof descriptions] || descriptions.tech;
}

function getDetailLevelDescription(level: string): string {
    const descriptions = {
        'concept': 'Only represent core concepts and overall form',
        'simplified': 'Retain key features, remove complex details',
        'standard': 'Balanced detail representation, suitable for general display',
        'refined': 'Rich surface details and material representation',
        'extreme': 'Photo-realistic quality, including all micro-details'
    };
    return descriptions[level as keyof typeof descriptions] || descriptions.standard;
}

function getFunctionalFusionDescription(type: string): string {
    const descriptions = {
        'none': 'Only visual fusion, no functional concept involvement',
        'hint': 'Suggest reference image functional features through design elements',
        'metaphor': 'Transform reference image functional concepts into design metaphors',
        'integration': 'Attempt to integrate functional characteristics of both in design',
        'reconstruction': 'Reimagine product purpose based on functional features of both'
    };
    return descriptions[type as keyof typeof descriptions] || descriptions.metaphor;
}

function getFusionGuidance(colorMaterialFusion: string, formStructureFusion: string, designStyle: string, functionalFusion: string): string {
    let guidance = '';

    // Color and Material Fusion Guidance
    if (colorMaterialFusion === 'slight') {
        guidance += '- Color and Material: Extract 1-2 main colors from reference image, lightly adjust product surface texture\n';
    } else if (colorMaterialFusion === 'medium') {
        guidance += '- Color and Material: Balance fusion of both color systems and material characteristics, create a new color scheme\n';
    } else if (colorMaterialFusion === 'strong') {
        guidance += '- Color and Material: Primarily adopt reference image color system, deeply simulate material texture and surface treatment\n';
    } else if (colorMaterialFusion === 'complete') {
        guidance += '- Color and Material: Completely adopt reference image color language and material system\n';
    }

    // Form and Structure Fusion Guidance
    if (formStructureFusion === 'contour') {
        guidance += '- Form and Structure: Adopt reference image overall contour, maintain product basic functional layout\n';
    } else if (formStructureFusion === 'proportion') {
        guidance += '- Form and Structure: Fusion of reference image golden ratio and size relationships, optimize product ergonomics\n';
    } else if (formStructureFusion === 'structure') {
        guidance += '- Form and Structure: Deep integration of both structural frameworks, redesign component layout and connection methods\n';
    } else if (formStructureFusion === 'complete') {
        guidance += '- Form and Structure: Basic adoption of reference image form language, innovation in functional implementation\n';
    }

    // Design Style Guidance
    if (designStyle === 'minimal') {
        guidance += '- Design Style: Adopt minimalist aesthetics, remove excessive decoration, focus on functionality and line beauty\n';
    } else if (designStyle === 'vintage') {
        guidance += '- Design Style: Incorporate vintage elements, embody nostalgic sentiment and traditional craftsmanship aesthetics\n';
    } else if (designStyle === 'tech') {
        guidance += '- Design Style: Futuristic tech feel, use luminous elements and modern high-tech materials\n';
    } else if (designStyle === 'organic') {
        guidance += '- Design Style: Organic forms, simulate natural streamlined and biomimetic elements\n';
    } else if (designStyle === 'luxury') {
        guidance += '- Design Style: Luxury and refinement, focus on detailed craftsmanship and noble material application\n';
    } else if (designStyle === 'industrial') {
        guidance += '- Design Style: Industrial aesthetics, showcase mechanical beauty and functionality-first design philosophy\n';
    }

    // Functional Concept Fusion Guidance
    if (functionalFusion === 'hint') {
        guidance += '- Functional Concept: Cleverly suggest reference image functional features through design elements, enhance product storytelling\n';
    } else if (functionalFusion === 'metaphor') {
        guidance += '- Functional Concept: Transform reference image functional concepts into design metaphors, create meaningful formal language\n';
    } else if (functionalFusion === 'integration') {
        guidance += '- Functional Concept: Deep integration of both functional features, create innovative products with dual attributes\n';
    } else if (functionalFusion === 'reconstruction') {
        guidance += '- Functional Concept: Redefine product purpose based on both functional features, break traditional product boundaries\n';
    }

    return guidance;
}

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        console.log('[Generate Image] Fast Response Strategy - Starting...');
        
        const { imageData, mode, settings, sceneImageData, referenceImageData } = await req.json();
        console.log('[Generate Image] Mode:', mode);

        if (!imageData) {
            throw new Error('产品图片数据缺失，请先上传产品图片');
        }

        if (mode === 'fusion' && !referenceImageData) {
            throw new Error('AI Fusion Design mode requires reference image upload');
        }

        const apiKey = Deno.env.get('DOMINO_API_KEY');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!apiKey || !serviceRoleKey) {
            throw new Error('API密钥配置缺失');
        }

        // 快速上传图片
        let imageUrl = null;
        let sceneImageUrl = null;
        let referenceImageUrl = null;
        
        if (imageData) {
            console.log('[Generate Image] Uploading product image...');
            const base64Image = imageData.split(',')[1];
            if (!base64Image) {
                throw new Error('图片数据格式错误');
            }
            
            const imageBlob = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
            const fileName = `input-${Date.now()}.jpg`;
            
            const uploadResponse = await fetch('https://upvhkmfgwialiqompeea.supabase.co/storage/v1/object/ai-generated-images/' + fileName, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'image/jpeg'
                },
                body: imageBlob
            });
            
            if (uploadResponse.ok) {
                imageUrl = `https://upvhkmfgwialiqompeea.supabase.co/storage/v1/object/public/ai-generated-images/${fileName}`;
                console.log('[Generate Image] ✅ Product image uploaded');
            } else {
                throw new Error('产品图片上传失败');
            }
        }
        
        // 如果是场景替换模式且有场景图片数据，上传场景图片
        if (mode === 'scene' && sceneImageData) {
            console.log('[Generate Image] Uploading scene image...');
            const base64SceneImage = sceneImageData.split(',')[1];
            if (!base64SceneImage) {
                throw new Error('场景图片数据格式错误');
            }
            
            const sceneImageBlob = Uint8Array.from(atob(base64SceneImage), c => c.charCodeAt(0));
            const sceneFileName = `scene-${Date.now()}.jpg`;
            
            const sceneUploadResponse = await fetch('https://upvhkmfgwialiqompeea.supabase.co/storage/v1/object/ai-generated-images/' + sceneFileName, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'image/jpeg'
                },
                body: sceneImageBlob
            });
            
            if (sceneUploadResponse.ok) {
                sceneImageUrl = `https://upvhkmfgwialiqompeea.supabase.co/storage/v1/object/public/ai-generated-images/${sceneFileName}`;
                console.log('[Generate Image] ✅ Scene image uploaded');
            } else {
                throw new Error('场景图片上传失败');
            }
        }

        // 如果是AI融合设计模式且有参考图片数据，上传参考图片
        if (mode === 'fusion' && referenceImageData) {
            console.log('[Generate Image] Uploading reference image...');
            const base64ReferenceImage = referenceImageData.split(',')[1];
            if (!base64ReferenceImage) {
                throw new Error('参考图片数据格式错误');
            }
            
            const referenceImageBlob = Uint8Array.from(atob(base64ReferenceImage), c => c.charCodeAt(0));
            const referenceFileName = `reference-${Date.now()}.jpg`;
            
            const referenceUploadResponse = await fetch('https://upvhkmfgwialiqompeea.supabase.co/storage/v1/object/ai-generated-images/' + referenceFileName, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'image/jpeg'
                },
                body: referenceImageBlob
            });
            
            if (referenceUploadResponse.ok) {
                referenceImageUrl = `https://upvhkmfgwialiqompeea.supabase.co/storage/v1/object/public/ai-generated-images/${referenceFileName}`;
                console.log('[Generate Image] ✅ Reference image uploaded');
            } else {
                throw new Error('参考图片上传失败');
            }
        }

        // 构建专业级提示词
        let prompt = '';
        if (mode === 'wireframe') {
            const { type, detail, style } = settings;
            const wireframeType = type || 'engineering';
            const detailLevel = detail || 'medium';
            const wireframeStyle = style || 'technical';
            
            // 主提示词模板
            const basePrompt = `Create a wireframe illustration based on the uploaded product image.

Wireframe type: ${wireframeType}
Detail level: ${detailLevel}
Style: ${wireframeStyle}

Requirements:
- Analyze the product's form, structure, and key features
- Generate clean wireframe lines that capture the essential geometry
- Maintain accurate proportions and perspective from the original product
- Output should be vector-style or clean line art on transparent/white background`;

            // 线框图类型详细配置
            const typeDescriptions = {
                engineering: `Technical engineering wireframe showing structural framework, mechanical components, and assembly relationships. Include construction lines, hidden edges, and technical annotations if needed.`,
                conceptual: `Conceptual wireframe focusing on overall form, silhouette, and design intent. Emphasize creative flow and aesthetic proportions over technical details.`
            };

            // 细节程度详细配置
            const detailDescriptions = {
                low: `Minimal wireframe showing only primary contours and major structural lines. Use sparse linework to capture essential shape only.`,
                medium: `Balanced wireframe including primary contours, secondary features, and important internal structures. Show key design elements without overcrowding.`,
                high: `Comprehensive wireframe with full structural details, complex geometries, surface textures, and intricate components. Include fine details and complex linework.`
            };

            // 线框风格详细配置
            const styleDescriptions = {
                minimal: `Minimalist aesthetic using uniform thin lines, negative space, and clean geometry. Focus on simplicity and elegance with reduced visual noise.`,
                technical: `Technical drawing style with varied line weights, cross-sections, and engineering annotations. Include construction guidelines and technical precision.`,
                artistic: `Artistic interpretation with expressive lines, dynamic strokes, and creative composition. May include subtle shading or stylized elements for visual appeal.`
            };

            // 完整组合提示词
            const completePrompt = `${basePrompt}

Type specifications:
${typeDescriptions[wireframeType]}

Detail specifications:
${detailDescriptions[detailLevel]}

Style specifications:
${styleDescriptions[wireframeStyle]}

Processing guidelines:
- For engineering type: Emphasize structural integrity and technical components
- For conceptual type: Highlight design flow and aesthetic proportions
- Adjust line density and complexity according to detail level
- Apply the selected visual style while maintaining clarity
- Ensure the wireframe accurately represents the original product form
- Output clean, professional results suitable for design documentation`;

            prompt = completePrompt;
        } else if (mode === 'multi-view') {
            const { viewType, angle, elevation, perspectiveType } = settings;
            
            if (viewType === 'three-view') {
                prompt = "Create a three-view technical drawing showing front view, side view, and top view arranged in a single image, with transparent background, clean line art, engineering drawing style";
            } else if (viewType === 'free-view') {
                // 优化的自由视角提示词生成
                const horizontalAngle = angle || 45;
                const verticalAngle = elevation || 0; // 修改默认仰角为0度（水平视角）
                
                // 角度映射
                const horizontalMapping = {
                    0: "正面视角",
                    22.5: "右前侧轻转视角", 
                    45: "右前侧视角",
                    67.5: "右前侧陡转视角",
                    90: "右侧视角",
                    112.5: "右后侧陡转视角",
                    135: "右后侧视角",
                    157.5: "右后侧偏转视角",
                    180: "背面视角",
                    202.5: "左后侧偏转视角",
                    225: "左后侧视角",
                    247.5: "左后侧陡转视角",
                    270: "左侧视角",
                    292.5: "左前侧陡转视角",
                    315: "左前侧视角",
                    337.5: "左前侧轻转视角"
                };
                
                const verticalMapping = {
                    -90: "正顶垂直俯视",
                    -75: "极端高角度俯视",
                    -60: "高角度俯视",
                    -45: "明显俯视",
                    -30: "中等俯视",
                    -15: "轻微俯视",
                    0: "水平正视视角",
                    15: "轻微仰视",
                    30: "中等仰视",
                    45: "明显仰视",
                    60: "低角度仰视",
                    75: "极端仰视",
                    90: "正底垂直仰视"
                };
                
                // 获取最接近的角度描述
                const getClosestAngle = (mapping: Record<number, string>, targetAngle: number): string => {
                    const angles = Object.keys(mapping).map(Number).sort((a, b) => Math.abs(a - targetAngle) - Math.abs(b - targetAngle));
                    return mapping[angles[0]] || mapping[0];
                };
                
                const horizontalDesc = getClosestAngle(horizontalMapping, horizontalAngle);
                const verticalDesc = getClosestAngle(verticalMapping, verticalAngle);
                
                // 生成专业级提示词
                prompt = `As a professional 3D rendering expert, generate a view of the product from the specified perspective.

**Perspective Configuration:**
- Horizontal Angle: ${horizontalAngle}° (${horizontalDesc})
- Vertical Angle: ${verticalAngle}° (${verticalDesc})

**Technical Rendering Requirements:**

1. **Geometric Perspective Accuracy**
   - Apply standard three-point perspective projection principles
   - Ensure horizontal and vertical vanishing points are accurate
   - Maintain realistic object proportion relationships

2. **Spatial Reconstruction Quality**
   - Reasonably infer geometric structure of occluded areas based on original perspective
   - Maintain 3D spatial relationships in the original scene
   - Preserve relative positions and proportions between objects

3. **Material and Texture Consistency**
   - Completely retain material properties from the original image
   - Maintain texture details and surface characteristics
   - Preserve color saturation and light-dark relationships

4. **Lighting Physical Accuracy**
   - Adjust light source direction and intensity according to new perspective
   - Calculate accurate ambient lighting and reflections
   - Create natural shadow casting and receiving

5. **Visual Coherence**
   - Maintain artistic style and capture quality of the original image
   - Ensure detail sharpness and noise levels remain consistent
   - Achieve smooth depth of field transition effects

**Output Requirements:**
- Format: High-quality PNG image
- Resolution: Maintain original image resolution
- Style: Completely follow visual characteristics of the original image
- Background: Naturally extend scene boundaries according to new perspective

**Quality Control Standards:**
- Zero image deformation or stretching
- Accurate lighting and shadow physical effects
- Reasonable occlusion relationships
- Photorealistic rendering quality

**Perspective Transformation Task:**
Transform the original product image to be viewed from ${horizontalDesc} with ${verticalDesc}. Maintain complete material and texture fidelity while applying accurate geometric perspective transformations.`;
                
            } else if (viewType === 'perspective') {
                const perspectivePrompts = {
                    'one-point': "Redraw with one-point perspective, depth enhancement",
                    'two-point': "Redraw with two-point perspective, realistic spatial view",
                    'three-point': "Redraw with three-point perspective, dramatic effect"
                };
                prompt = perspectivePrompts[perspectiveType || 'one-point'];
            }
        } else if (mode === 'scene') {
            const { source, scenePrompt, blendIntensity } = settings;
            
            if (source === 'upload' && sceneImageData) {
                // 上传场景图片模式 - 使用融合强度
                const blendValue = blendIntensity || 50;
                
                if (blendValue === 0) {
                    // 0% 轻微融合 - 保持原图，最小场景变化
                    prompt = `Image composition task: Integrate the product image into the provided scene image with ${blendValue}% fusion intensity.

Fusion intensity guidelines:
- ${blendValue}%: Preserve the original product image with minimal scene changes

Technical requirements:
1. Maintain product recognizability at all intensity levels
2. Adjust lighting, shadows, and color tones to match the scene environment
3. Ensure realistic perspective and proportions relative to the scene
4. Create natural transitions between product edges and scene background
5. Preserve key product features while adapting to environmental context

Gently place the product into the scene with minimal environmental impact. Maintain 95% of original product appearance. Only make subtle adjustments to lighting and shadows to match the scene's direction. Keep product fully recognizable with sharp edges.`;
                } else if (blendValue <= 25) {
                    // 1-25% 轻微融合
                    prompt = `Image composition task: Integrate the product image into the provided scene image with ${blendValue}% fusion intensity.

Fusion intensity guidelines:
- ${blendValue}%: Subtle integration with gentle environmental adjustments

Technical requirements:
1. Maintain product recognizability at all intensity levels
2. Adjust lighting, shadows, and color tones to match the scene environment
3. Ensure realistic perspective and proportions relative to the scene
4. Create natural transitions between product edges and scene background
5. Preserve key product features while adapting to environmental context

Gently place the product into the scene with minimal environmental impact. Maintain 90-95% of original product appearance. Only make subtle adjustments to lighting and shadows to match the scene's direction. Keep product fully recognizable with sharp edges.`;
                } else if (blendValue <= 50) {
                    // 26-50% 中等融合
                    prompt = `Image composition task: Integrate the product image into the provided scene image with ${blendValue}% fusion intensity.

Fusion intensity guidelines:
- ${blendValue}%: Balanced fusion maintaining product identity while blending with surroundings

Technical requirements:
1. Maintain product recognizability at all intensity levels
2. Adjust lighting, shadows, and color tones to match the scene environment
3. Ensure realistic perspective and proportions relative to the scene
4. Create natural transitions between product edges and scene background
5. Preserve key product features while adapting to environmental context

Workflow:
1. Analyze the scene image's lighting conditions, color temperature, and perspective
2. Examine the product image for key features and structural elements
3. Apply fusion at ${blendValue}% level according to the intensity guidelines
4. Ensure realistic shadow casting based on scene light sources
5. Adjust product saturation and contrast to match scene characteristics

Blend the product into the scene while maintaining its core identity. Adjust colors and lighting to harmonize with the environment. Add realistic shadows and slight environmental reflections. Product should feel part of the scene while remaining clearly distinguishable.`;
                } else if (blendValue <= 75) {
                    // 51-75% 强融合
                    prompt = `Image composition task: Integrate the product image into the provided scene image with ${blendValue}% fusion intensity.

Fusion intensity guidelines:
- ${blendValue}%: Strong integration where product adapts to scene but remains clearly visible

Technical requirements:
1. Maintain product recognizability at all intensity levels
2. Adjust lighting, shadows, and color tones to match the scene environment
3. Ensure realistic perspective and proportions relative to the scene
4. Create natural transitions between product edges and scene background
5. Preserve key product features while adapting to environmental context

Workflow:
1. Analyze the scene image's lighting conditions, color temperature, and perspective
2. Examine the product image for key features and structural elements
3. Apply fusion at ${blendValue}% level according to the intensity guidelines
4. Ensure realistic shadow casting based on scene light sources
5. Adjust product saturation and contrast to match scene characteristics

Integrate the product deeply into the scene environment. Adapt product colors and textures to match surroundings while keeping essential features visible. Create strong environmental lighting effects and contextual shadows. Make the product appear naturally situated in the scene.`;
                } else if (blendValue <= 90) {
                    // 76-90% 场景主导融合
                    prompt = `Image composition task: Integrate the product image into the provided scene image with ${blendValue}% fusion intensity.

Fusion intensity guidelines:
- ${blendValue}%: Scene-dominant integration with natural product placement

Technical requirements:
1. Maintain product recognizability at all intensity levels
2. Adjust lighting, shadows, and color tones to match the scene environment
3. Ensure realistic perspective and proportions relative to the scene
4. Create natural transitions between product edges and scene background
5. Preserve key product features while adapting to environmental context

Workflow:
1. Analyze the scene image's lighting conditions, color temperature, and perspective
2. Examine the product image for key features and structural elements
3. Apply fusion at ${blendValue}% level according to the intensity guidelines
4. Ensure realistic shadow casting based on scene light sources
5. Adjust product saturation and contrast to match scene characteristics

Seamlessly merge the product with the scene background. Use the scene's lighting, color palette, and atmospheric conditions to transform the product's appearance. Maintain only the essential silhouette and key features. Achieve photorealistic integration where the product appears native to the environment.`;
                } else {
                    // 91-100% 完全融合
                    prompt = `Image composition task: Integrate the product image into the provided scene image with ${blendValue}% fusion intensity.

Fusion intensity guidelines:
- ${blendValue}%: Precise scene background usage with exact product positioning

Technical requirements:
1. Maintain product recognizability at all intensity levels
2. Adjust lighting, shadows, and color tones to match the scene environment
3. Ensure realistic perspective and proportions relative to the scene
4. Create natural transitions between product edges and scene background
5. Preserve key product features while adapting to environmental context

Workflow:
1. Analyze the scene image's lighting conditions, color temperature, and perspective
2. Examine the product image for key features and structural elements
3. Apply fusion at ${blendValue}% level according to the intensity guidelines
4. Ensure realistic shadow casting based on scene light sources
5. Adjust product saturation and contrast to match scene characteristics
6. Final output should show natural integration while maintaining specified fusion strength

Seamlessly merge the product with the scene background. Use the scene's lighting, color palette, and atmospheric conditions to transform the product's appearance. Maintain only the essential silhouette and key features. Achieve photorealistic integration where the product appears native to the environment.

Important: The product must remain identifiable at every fusion level, only the degree of environmental adaptation should change.`;
                }
            } else if (source === 'prompt' && scenePrompt) {
                // 提示词模式 - 忽略融合参数
                const scenePrompts = {
                    'modern-office': "Place in modern office with tech lighting, professional workspace with clean lines and contemporary furniture",
                    'industrial': "Place in industrial scene with metal textures, factory environment with steel structures and mechanical elements", 
                    'e-commerce': "Create an e-commerce product showcase with professional lighting, clean white background, premium presentation, studio photography style",
                    'nature': "Place in natural outdoor environment, surrounded by natural elements and organic lighting",
                    'night-city': "Place in nighttime city with neon lights, urban atmosphere with cityscape and electric ambiance",
                    'minimalist': "Place in minimalist clean environment, simple and elegant setting with neutral tones",
                    'outdoor-sports': "Place in outdoor sports environment, active lifestyle setting with natural lighting and sporty atmosphere",
                    'family-gathering': "Place in family gathering scene, warm home environment with cozy atmosphere and social interaction"
                };
                prompt = scenePrompts[scenePrompt] || scenePrompt;
            }
        } else if (mode === 'fusion') {
            // AI Fusion Design Mode - Based on parametric design guidelines
            const {
                colorMaterialFusion = 'medium',
                formStructureFusion = 'proportion',
                designStyle = 'tech',
                detailLevel = 'standard',
                functionalFusion = 'metaphor',
                customDescription = ''
            } = settings;

            // Main prompt
            const basePrompt = `Perform AI fusion design based on product original image and reference image to create a new product design that combines characteristics of both.

Fusion parameter configuration:
- Color and Material Fusion: ${getColorMaterialDescription(colorMaterialFusion)}
- Form and Structure Fusion: ${getFormStructureDescription(formStructureFusion)}
- Design Style: ${getDesignStyleDescription(designStyle)}
- Detail Level: ${getDetailLevelDescription(detailLevel)}
- Functional Concept Fusion: ${getFunctionalFusionDescription(functionalFusion)}

Technical Requirements:
1. Maintain product basic functionality and recognizability
2. Fusion should be natural and reasonable, avoid abrupt design changes
3. Focus on overall coordination of materials, proportions, and details
4. Reflect core design elements and concepts from reference image
5. Ensure final product has modern aesthetics and practicality`;

            // Detailed fusion guidance
            const fusionGuidance = getFusionGuidance(
                colorMaterialFusion,
                formStructureFusion,
                designStyle,
                functionalFusion
            );

            const completePrompt = `${basePrompt}

Detailed Fusion Guidance:
${fusionGuidance}

${customDescription ? `Custom Requirements: ${customDescription}` : ''}

Output Requirements: Professional product rendering, 4K resolution, pure white background, ensure natural and innovative fusion effects.`;

            prompt = completePrompt;
        }

        if (!prompt) {
            throw new Error('提示词生成失败');
        }
        
        console.log('[Generate Image] Prompt:', prompt);

        // 快速调用多米API
        const apiUrl = 'https://duomiapi.com/api/gemini/nano-banana-edit';
        const requestBody = {
            prompt: prompt,
            image_urls: [],
            aspect_ratio: '1:1'
        };
        
        // 智能判断图片传递模式
        if (mode === 'fusion' && referenceImageUrl) {
            // AI融合设计模式：传递产品图片和参考图片
            requestBody.image_urls = [imageUrl, referenceImageUrl];
            console.log('[Generate Image] AI Fusion mode: using product image and reference image');
            console.log('[Generate Image] Product URL:', imageUrl);
            console.log('[Generate Image] Reference URL:', referenceImageUrl);
            console.log('[Generate Image] Combined image_urls array:', JSON.stringify(requestBody.image_urls));
        } else if (mode === 'scene' && sceneImageUrl) {
            // 场景替换模式：传递产品图片和场景图片
            requestBody.image_urls = [imageUrl, sceneImageUrl];
            console.log('[Generate Image] Scene fusion mode: using product image and scene image');
            console.log('[Generate Image] Product URL:', imageUrl);
            console.log('[Generate Image] Scene URL:', sceneImageUrl);
            console.log('[Generate Image] Combined image_urls array:', JSON.stringify(requestBody.image_urls));
        } else {
            // 其他模式：只传递产品图片
            requestBody.image_urls = [imageUrl];
            console.log('[Generate Image] Single image mode: using only product image');
            console.log('[Generate Image] Product URL:', imageUrl);
            console.log('[Generate Image] image_urls array:', JSON.stringify(requestBody.image_urls));
        }

        console.log('[Generate Image] Final request body:', JSON.stringify(requestBody, null, 2));
        console.log('[Generate Image] Calling Duomi API...');
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('[Generate Image] API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Generate Image] API error:', errorText);
            throw new Error(`多米API调用失败: ${response.status}`);
        }

        const result = await response.json();
        console.log('[Generate Image] ✅ Task created:', result.data?.task_id);
        
        if (result.code !== 200) {
            throw new Error(`多米API调用失败: ${result.msg || '未知错误'}`);
        }

        // 立即返回task_id，让前端负责轮询
        if (result.data && result.data.task_id) {
            const taskId = result.data.task_id;
            console.log('[Generate Image] ✅ Returning task ID for frontend polling');
            
            return new Response(JSON.stringify({
                data: {
                    taskId: taskId,
                    status: 'processing',
                    message: 'Image generation failed, please try again',
                    frontEndPolling: true,
                    pollingUrl: `https://upvhkmfgwialiqompeea.supabase.co/functions/v1/poll-task/${taskId}`
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        } else {
            throw new Error('多米API返回格式异常');
        }

    } catch (error) {
        console.error('[Generate Image] ERROR:', error.message);
        
        return new Response(JSON.stringify({
            error: {
                code: 'IMAGE_GENERATION_FAILED',
                message: error.message,
                userMessage: '图片生成失败，请重试',
                timestamp: new Date().toISOString()
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});