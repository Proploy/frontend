'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';

const imgBitbucket = "/figma-assets/037e84947c2a4908a5313764d597a0d5a6a0f084.svg";
const imgBorder = "/figma-assets/29599994635cb0e4374299477bfaf89fac007270.svg";
const imgBg = "/figma-assets/17c952931ec81f79af8517eae34d5cbda3219d35.svg";
const imgBorder1 = "/figma-assets/01ba56e493555e6a47a4a66a091cfadd986177d3.svg";
const imgPhone = "/figma-assets/0237e73999a6a6f6973ad840f9f2f601ec1e9950.svg";
const imgBg1 = "/figma-assets/56f3a4d1673e41f7bac24a99cd0a7738b49c66f1.svg";
const imgGCalendar = "/figma-assets/c58738b0f359b0f9fa20cc750a2fd138dc646fea.svg";
const imgZendesk = "/figma-assets/db1d93e4c70dee1f2295fa860e2783918ef1e51f.svg";
const imgBg2 = "/figma-assets/06fe1ae9042d162de4a008b137998a5638c38396.svg";
const imgMailchimp = "/figma-assets/5b75661d27534b48f34cabe59d7791e419728825.svg";
const imgConfluence = "/figma-assets/0b3d2f5c3eb74095beba5cadbdd68dc34098bd31.svg";
const imgVector = "/figma-assets/6936e7545f528a357529a25a46f563e4b4edc6ec.svg";
const imgVector1 = "/figma-assets/5961e6b35231e5ef046ae089f6bf450930a86f81.svg";
const imgVector2 = "/figma-assets/282a40ba62d0215d60adc22e4910a99a6cc7ad1f.svg";
const imgVector3 = "/figma-assets/c5f20953debb47ce8363f85b65c76bd8ac8a89b7.svg";
const imgVector4 = "/figma-assets/1de656e1c94986ed2e3ae6de104eb97d3bf3171a.svg";
const imgZapier = "/figma-assets/b2d383559664a994b7ccb9ec433aa35289e52d7f.svg";
const imgVector5 = "/figma-assets/244a19e0b935587323da723cbfa2ae7b789c4cdb.svg";
const imgVector6 = "/figma-assets/f284ef6431e1b467760e6545aca206ea7bfc791b.svg";
const imgVector7 = "/figma-assets/71e211cb98e7897c8b47e6c0871f25e8aad80b62.svg";
const imgVector8 = "/figma-assets/e3d84d853d934ba6228edaf02e858f7a7a65599e.svg";
const imgVector9 = "/figma-assets/a1fba0b77ccea82e078dd8481c5cd9dcd24d4651.svg";
const imgS = "/figma-assets/df87fc1b6e7aa65ec1cad6c18f76c92f0967707f.svg";
const imgBg3 = "/figma-assets/3ab807121d6b06fc4e61fc1dbde1dfe4f851be4c.svg";
const imgDropbox = "/figma-assets/58c86ad5b1f209b829c38b29d95b241f0590de62.svg";
const imgJira = "/figma-assets/3cfffe4377ece59c767cedf8f8508772137336a0.svg";
const imgBg4 = "/figma-assets/347d95720b68dff78f3394d020e245195992b337.svg";
const imgIntercom = "/figma-assets/f52d0394af75c43b283a2e72afe0ebde71d5fd94.svg";
const imgGDrive = "/figma-assets/addb3b1e6256936b7276d38e00d77bd11fb22e6c.svg";
const imgSlack = "/figma-assets/7f90c2f88306fca5faa7faefd7de98e988910d1b.svg";
const imgBg5 = "/figma-assets/080d123fdd49f2bef0a3ff77860937bc5900aedf.svg";
const imgVector10 = "/figma-assets/3ec23df593ee267959aa1a91a218a89fcb54638f.svg";
const imgIcon = "/figma-assets/1f431b26fd8545b154f5eb1825f63cc6f23d4ca1.svg";
const imgIcon1 = "/figma-assets/378702e9aa0644e08926750ac1a2f04f0533511f.svg";
const imgLogomark = "/figma-assets/365c0026ee52c229d468fd248392cd61c03d0607.svg";
const imgLogotext = "/figma-assets/7b7234c342e4b735d68012865722bd32f80d6897.svg";
const imgLogomark1 = "/figma-assets/b6c354815b43e85127159477fe1dbd9a5881362b.svg";
const imgLogotext1 = "/figma-assets/4ca1f57a2690be8a1fac2ed858983c098868bb13.svg";
const imgLogomark2 = "/figma-assets/fd610476ba2694dbb487c6452d0ba7c3fef5a0f6.svg";
const imgLogotext2 = "/figma-assets/f1cda22636288c178b381c04f7449f049a492cd3.svg";
const imgLogotext3 = "/figma-assets/8c9ea815f06d68387ebd1c0c3007b89d83379ff8.svg";
const imgLogomark3 = "/figma-assets/0103f524aa389d55e0e680e11cba31d914e70a2d.svg";
const imgLogotext4 = "/figma-assets/dc07fd31e77a4d8bd6fc374dedc394bdec57797c.svg";
const imgLogomark4 = "/figma-assets/63bc7bdc098c5fab7b862f7bd209400e5bf77b85.svg";
const imgLogotext5 = "/figma-assets/7b8d2ac301c3d7b680b9d2d7d1ddd8cfbc5d3bb8.svg";
const imgLogomark5 = "/figma-assets/9d8fe315c2402a57e6bc312386315b7ceb322396.svg";
const imgLogotext6 = "/figma-assets/0b86d664b20641db30cf39a2caf5afd592096c16.svg";
const imgContainer1 = "/figma-assets/1e8eaf2f1b4e1fa32894f487ba287284460d1299.png";
const imgGeminiGeneratedImageIoc2Daioc2Daioc21 = "/figma-assets/0b9315789c848f7a8ac53ba5871048ea90029d75.png";
const imgTabImage2 = "/figma-assets/352239e5f449a217089e940f7fdf36ec97286405.png";
const imgTabImage3 = "/figma-assets/e82d8019761b6a7a85a9637644f7b60240dacb53.png";
const imgAvatar = "/figma-assets/6424b0d14893954b1bbf127484daab7d652e2e3f.png";
const imgAvatar1 = "/figma-assets/ab9201148cfdefe023e21366139405f0dda8c4d3.png";
const imgAvatar2 = "/figma-assets/f411169b0890cb85aaf2ca68bc27e793bfc47b0c.png";
const imgScreenMockupReplaceFill = "/figma-assets/6b728be75f7b6ba020586186092d2988d2a5034a.png";
const imgScreenMockupReplaceFill1 = "/figma-assets/160a0878cd016272842cabb04b48536a124fbb28.png";
const imgVertical = "/figma-assets/54bc3bc48d15c56de14fa13fd92351bb0ef18246.svg";
const imgHorizontal = "/figma-assets/f2349eaef432dea204927a5824dd246bfccf9d68.svg";
const imgIcon2 = "/figma-assets/9b8784a35052af219c1b0716f94b666382b3393a.svg";
const imgIcon3 = "/figma-assets/5756290420e20cbe9696b1e065bf57345ac87f09.svg";
const imgLogomark6 = "/figma-assets/bd6923deae5eb38ca8077d0a4868cce6c2c83fde.svg";
const imgDot = "/figma-assets/e9ad58dc39dc78b804345e140353164c66c02626.svg";
const imgIcon4 = "/figma-assets/c1fe035b9065db585ad30e1d6b033aeccda0b906.svg";
const imgRight = "/figma-assets/5c91708a0c5f1f32cd6fc8a2c2a0496fc88afb66.svg";
const imgDate = "/figma-assets/acee305a2fd7ebddcd8c4c28d8d1eb75a58c2462.svg";
const imgButtons = "/figma-assets/413cfe6ec878f937bdfc805aada1cb7fce601def.svg";
const imgDeviceSurround = "/figma-assets/badd233695b5df827af645e1e63368073dbd3de9.svg";
const imgHighlightBand = "/figma-assets/d9bfb344e72951cd38971b772b044e965da7bff5.svg";
const imgBackground = "/figma-assets/27a7d5ffa1c248519cfabd6a7d6314a89ad5233b.svg";
const imgCamera = "/figma-assets/36a305917240e0f6a986c143249483c8c580b330.svg";
const imgSpeaker = "/figma-assets/82aaa959344416378a62a308b5ffbdb902b3b101.svg";
const imgRight1 = "/figma-assets/147900732bc214d1106f5d5f91c726b018f14d70.svg";
const imgIcon5 = "/figma-assets/87914c0fc2b8596d07da6d2a31375d0cccdaa3d6.svg";
const imgIcon6 = "/figma-assets/a9de671d76df02ee8c2154ac505828a4220070a2.svg";
const imgBg6 = "/figma-assets/1f0cb1a4521463f99b64fd61ef7618b87e1bd1b9.svg";
const imgVector11 = "/figma-assets/de60a74ccf09d450410469f25f2550f93f28095e.svg";
const imgVector12 = "/figma-assets/75baadf3b77ef3d935aafa1c9b8e09f037efcfba.svg";
const imgSocialIcon = "/figma-assets/6ca668074a1b41da89258516519648f14b0affd2.svg";
const imgVector13 = "/figma-assets/6f1370b81e7c3c55c87030b09327de26081a1283.svg";
const imgVector14 = "/figma-assets/51a8405e07fce0819eda7bb2ee0943fc1a1ec30b.svg";
const imgVector15 = "/figma-assets/d8536413008fcdff809659ca63b7b960db7d7d3f.svg";
const imgSocialIcon1 = "/figma-assets/9dc208c39b518559e692e38c7f024a68f422cacb.svg";
const imgVector16 = "/figma-assets/495044ae1815265d4d47b01d4a50a132a35351c7.svg";
const imgVector17 = "/figma-assets/6ae1bdaf1c39bddc1b6c8fa2e198cf69a606a554.svg";
const imgVector18 = "/figma-assets/16a7f4092c7d3804bd762d7680b91c435dde9acc.svg";

// Animation wrapper components
const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >{children}</motion.div>
)

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >{children}</motion.div>
)

function Logo({ className }: { className?: string }) {
  return (
    <div className={className || "flex items-center gap-2"} data-name="Logo">
      <img src="/proploy-logo.png" alt="Proploy Logo" className="h-auto w-full" />
    </div>
  );
}

function Bitbucket({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="bitbucket" data-node-id="2047:23213">
      <div className="absolute inset-[9.38%_6.25%]" data-name="bitbucket" data-node-id="2047:23214">
        <img alt="" className="absolute block max-w-none size-full" src={imgBitbucket} />
      </div>
    </div>
  );
}

function Whatsapp({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="whatsapp" data-node-id="2047:23205">
      <div className="absolute inset-[9.38%_6.25%_3.13%_6.25%]" data-name="border" data-node-id="2047:23206">
        <img alt="" className="absolute block max-w-none size-full" src={imgBorder} />
      </div>
      <div className="absolute inset-[12.5%]" data-name="bg" data-node-id="2047:23207">
        <img alt="" className="absolute block max-w-none size-full" src={imgBg} />
      </div>
      <div className="absolute inset-[6.25%]" data-name="border" data-node-id="2047:23208">
        <img alt="" className="absolute block max-w-none size-full" src={imgBorder1} />
      </div>
      <div className="absolute inset-[27.78%_26.82%_30.22%_27.44%]" data-name="phone" data-node-id="2047:23209">
        <img alt="" className="absolute block max-w-none size-full" src={imgPhone} />
      </div>
    </div>
  );
}

function GCalendar({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="g-calendar" data-node-id="2047:23189">
      <div className="absolute inset-[6.25%]" data-name="bg" data-node-id="2047:23190">
        <img alt="" className="absolute block max-w-none size-full" src={imgBg1} />
      </div>
      <div className="absolute inset-[18.75%]" data-name="g-calendar" data-node-id="2047:23191">
        <img alt="" className="absolute block max-w-none size-full" src={imgGCalendar} />
      </div>
    </div>
  );
}

function Zendesk({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="zendesk" data-node-id="2047:23187">
      <div className="absolute inset-[15.63%_6.25%]" data-name="zendesk" data-node-id="2047:23188">
        <img alt="" className="absolute block max-w-none size-full" src={imgZendesk} />
      </div>
    </div>
  );
}

function Mailchimp({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="mailchimp" data-node-id="2047:23184">
      <div className="absolute inset-[6.25%]" data-name="bg" data-node-id="2047:23185">
        <img alt="" className="absolute block max-w-none size-full" src={imgBg2} />
      </div>
      <div className="absolute inset-[15.63%_18.75%_15.63%_15.63%]" data-name="mailchimp" data-node-id="2047:23186">
        <img alt="" className="absolute block max-w-none size-full" src={imgMailchimp} />
      </div>
    </div>
  );
}

function Confluence({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="confluence" data-node-id="2047:23180">
      <div className="absolute inset-[12.5%]" data-name="confluence" data-node-id="2047:23181">
        <img alt="" className="absolute block max-w-none size-full" src={imgConfluence} />
      </div>
    </div>
  );
}

function Figma({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="figma" data-node-id="2047:23174">
      <div className="absolute bottom-[35.94%] left-1/2 right-[21.88%] top-[35.94%]" data-name="vector" data-node-id="2047:23175">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector} />
      </div>
      <div className="absolute bottom-[7.81%] left-[21.88%] right-1/2 top-[64.06%]" data-name="vector" data-node-id="2047:23176">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector1} />
      </div>
      <div className="absolute bottom-[64.06%] left-1/2 right-[21.88%] top-[7.81%]" data-name="vector" data-node-id="2047:23177">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector2} />
      </div>
      <div className="absolute bottom-[64.06%] left-[21.88%] right-1/2 top-[7.81%]" data-name="vector" data-node-id="2047:23178">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector3} />
      </div>
      <div className="absolute bottom-[35.94%] left-[21.88%] right-1/2 top-[35.94%]" data-name="vector" data-node-id="2047:23179">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector4} />
      </div>
    </div>
  );
}

function Zapier({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="zapier" data-node-id="2047:23172">
      <div className="absolute inset-[6.25%]" data-name="zapier" data-node-id="2047:23173">
        <img alt="" className="absolute block max-w-none size-full" src={imgZapier} />
      </div>
    </div>
  );
}

function Stripe({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="stripe" data-node-id="2047:23165">
      <div className="absolute inset-[6.25%]" data-name="vector" data-node-id="2047:23166">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector5} />
      </div>
      <div className="absolute inset-[9.23%_6.25%_6.25%_6.25%]" data-name="vector" data-node-id="2047:23167">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector6} />
      </div>
      <div className="absolute inset-[74.54%_7.16%_6.25%_50.18%]" data-name="vector" data-node-id="2047:23168">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector7} />
      </div>
      <div className="absolute inset-[6.25%_19.42%_81.34%_38.83%]" data-name="vector" data-node-id="2047:23169">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector8} />
      </div>
      <div className="absolute inset-[52.01%_6.25%_22.21%_78.01%]" data-name="vector" data-node-id="2047:23170">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector9} />
      </div>
      <div className="absolute inset-[27.85%_33.71%_25.29%_33.71%]" data-name="s" data-node-id="2047:23171">
        <img alt="" className="absolute block max-w-none size-full" src={imgS} />
      </div>
    </div>
  );
}

function Dropbox({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="dropbox" data-node-id="2047:23118">
      <div className="absolute inset-[6.25%]" data-name="bg" data-node-id="2047:23119">
        <img alt="" className="absolute block max-w-none size-full" src={imgBg3} />
      </div>
      <div className="absolute bottom-[21.88%] left-[18.75%] right-[18.75%] top-1/4" data-name="dropbox" data-node-id="2047:23120">
        <img alt="" className="absolute block max-w-none size-full" src={imgDropbox} />
      </div>
    </div>
  );
}

function Jira({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="jira" data-node-id="2047:23113">
      <div className="absolute inset-[6.25%]" data-name="jira" data-node-id="2047:23114">
        <img alt="" className="absolute block max-w-none size-full" src={imgJira} />
      </div>
    </div>
  );
}

function Intercom({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="intercom" data-node-id="2047:23110">
      <div className="absolute inset-[6.25%]" data-name="bg" data-node-id="2047:23111">
        <img alt="" className="absolute block max-w-none size-full" src={imgBg4} />
      </div>
      <div className="absolute inset-1/4" data-name="intercom" data-node-id="2047:23112">
        <img alt="" className="absolute block max-w-none size-full" src={imgIntercom} />
      </div>
    </div>
  );
}

function GoogleDrive({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="google_drive" data-node-id="2047:23089">
      <div className="absolute inset-[6.25%]" data-name="bg" data-node-id="2047:23090">
        <img alt="" className="absolute block max-w-none size-full" src={imgBg1} />
      </div>
      <div className="absolute inset-[18.75%_15.63%]" data-name="g-drive" data-node-id="2047:23091">
        <img alt="" className="absolute block max-w-none size-full" src={imgGDrive} />
      </div>
    </div>
  );
}

function Slack({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="slack" data-node-id="2047:23083">
      <div className="absolute inset-[9.38%]" data-name="slack" data-node-id="2047:23084">
        <img alt="" className="absolute block max-w-none size-full" src={imgSlack} />
      </div>
    </div>
  );
}

function Notion({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-name="notion" data-node-id="2047:22862">
      <div className="absolute inset-[3.13%]" data-name="bg" data-node-id="2047:22863">
        <img alt="" className="absolute block max-w-none size-full" src={imgBg5} />
      </div>
      <div className="absolute inset-[9.25%_9.46%]" data-name="vector" data-node-id="2047:22864">
        <img alt="" className="absolute block max-w-none size-full" src={imgVector10} />
      </div>
    </div>
  );
}
type CheckIconProps = {
  className?: string;
  color?: "Primary" | "Gray" | "Success";
  size?: "xs" | "sm" | "md" | "lg";
  type?: "Default" | "Line" | "Filled";
};

function CheckIcon({ className, color = "Primary", size = "xs", type = "Default" }: CheckIconProps) {
  const isLineAndMdAndPrimary = type === "Line" && size === "md" && color === "Primary";
  return (
    <div className={className || `overflow-clip relative rounded-full ${isLineAndMdAndPrimary ? "size-[28px]" : String.raw`bg-[var(--colors\/background\/bg-brand-primary,#eff4ff)] size-[20px]`}`} id={isLineAndMdAndPrimary ? "node-2047_19582" : "node-2047_19560"}>
      {type === "Default" && size === "xs" && color === "Primary" && (
        <div className="absolute inset-[29.65%_23.56%_26.58%_26.46%]" data-name="Icon" data-node-id="2047:19561">
          <img alt="" className="absolute block max-w-none size-full" src={imgIcon} />
        </div>
      )}
      {isLineAndMdAndPrimary && (
        <div className="absolute inset-0 overflow-clip" data-name="check-circle" data-node-id="2047:19583">
          <div className="absolute inset-[8.33%]" data-name="Icon" data-node-id="I2047:19583;3463:404968">
            <div className="absolute inset-[-5%]">
              <img alt="" className="block max-w-none size-full" src={imgIcon1} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
type CompanyLogoProps = {
  className?: string;
  company?: "3Portals" | "45 Degrees" | "Acme Corp" | "AlphaWave" | "Alt+Shift" | "Biosynthesis" | "Boltshift" | "BuildingBlocks" | "Capsule" | "Catalog" | "Chromatools" | "Clandestine" | "Calescence" | "CloudWatch" | "Codecraft_" | "Command+R" | "Constellation" | "ContrastAI" | "Convergence" | "Cooperative" | "CoreOS" | "Cubekit" | "EasyTax" | "Eclipseful" | "Eightball" | "Elasticware" | "ennLabs" | "Ephemeral" | "Epicurious" | "Euphoria" | "Europa" | "FeatherDev" | "Flora&Fauna" | "FocalPoint" | "Foresight" | "Fourpoints" | "Frequencii" | "Galileo" | "GlobalBank" | "Goodwell" | "Hexahedron" | "Hexsmith" | "Hourglass" | "Ikigai Labs" | "ImgCompress" | "Interlock" | "Kintsugi" | "LaunchSimple" | "Layers" | "Leapyear" | "Lightbox" | "Lightspeed" | "Luckycharm" | "Luminary" | "Luminescence" | "Luminous" | "Magnolia" | "Mastermail" | "Nietzsche" | "Norse Star" | "OdeaoLabs" | "Ollio" | "Pagemanage" | "Peregrin" | "PictelAI" | "Pollinate" | "Polymath" | "Powersurge" | "Prometheus" | "Quantum2" | "QuartzAI" | "Quixotic" | "Quotient" | "Radius" | "Railspeed" | "Refractional" | "Renaissance" | "Screentime" | "Segment" | "Shutterframe" | "Sisyphus" | "Solaris Energy" | "Sonorous" | "Spherule" | "Stack3d Lab" | "Visionwork" | "Voxel Labs" | "Warpspeed" | "Watchtower" | "Wildcrafted";
  darkMode?: boolean;
  logotext?: boolean;
  style?: "Default" | "Badge";
};

function CompanyLogo({ className, company = "3Portals", darkMode = false, logotext = true, style = "Default" }: CompanyLogoProps) {
  const isKintsugiAndDefaultAndFalse = company === "Kintsugi" && style === "Default" && !darkMode;
  const isMagnoliaAndDefaultAndFalse = company === "Magnolia" && style === "Default" && !darkMode;
  const isOdeaoLabsAndDefaultAndFalse = company === "OdeaoLabs" && style === "Default" && !darkMode;
  const isSisyphusAndDefaultAndFalse = company === "Sisyphus" && style === "Default" && !darkMode;
  const isStack3DLabAndDefaultAndFalse = company === "Stack3d Lab" && style === "Default" && !darkMode;
  const isWarpspeedAndDefaultAndFalse = company === "Warpspeed" && style === "Default" && !darkMode;
  return (
    <div className={className || `content-stretch flex relative ${isSisyphusAndDefaultAndFalse ? "gap-[10px] items-center" : style === "Default" && !darkMode && ["Kintsugi", "Magnolia"].includes(company) ? "gap-[8px] items-start" : "gap-[10px] items-start"}`} id={isWarpspeedAndDefaultAndFalse ? "node-2047_15451" : isStack3DLabAndDefaultAndFalse ? "node-2047_15379" : isSisyphusAndDefaultAndFalse ? "node-2047_15317" : isOdeaoLabsAndDefaultAndFalse ? "node-2047_14993" : isMagnoliaAndDefaultAndFalse ? "node-2047_14953" : isKintsugiAndDefaultAndFalse ? "node-2047_14843" : "node-2047_14261"}>
      <div className={`relative shrink-0 ${isStack3DLabAndDefaultAndFalse ? "h-[48px] w-[39px]" : isSisyphusAndDefaultAndFalse ? "h-[48px] w-[32px]" : style === "Default" && !darkMode && ["Magnolia", "Warpspeed"].includes(company) ? "size-[48px]" : "h-[48px] w-[40px]"}`} data-name="Logomark" id={isWarpspeedAndDefaultAndFalse ? "node-2047_15452" : isStack3DLabAndDefaultAndFalse ? "node-2047_15380" : isSisyphusAndDefaultAndFalse ? "node-2047_15318" : isOdeaoLabsAndDefaultAndFalse ? "node-2047_14994" : isMagnoliaAndDefaultAndFalse ? "node-2047_14954" : isKintsugiAndDefaultAndFalse ? "node-2047_14844" : "node-2047_14262"}>
        {style === "Default" && !darkMode && ["3Portals", "Kintsugi", "Magnolia", "Sisyphus", "Stack3d Lab", "Warpspeed"].includes(company) && <img alt="" className="absolute block max-w-none size-full" src={isWarpspeedAndDefaultAndFalse ? imgLogomark5 : isStack3DLabAndDefaultAndFalse ? imgLogomark4 : isSisyphusAndDefaultAndFalse ? imgLogomark3 : isMagnoliaAndDefaultAndFalse ? imgLogomark2 : isKintsugiAndDefaultAndFalse ? imgLogomark1 : imgLogomark} />}
        {isOdeaoLabsAndDefaultAndFalse && (
          <>
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[70.83%] left-0 right-3/4 top-[8.33%]" data-name="Vector" data-node-id="2047:14995" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[70.83%] left-1/4 opacity-0 right-1/2 top-[8.33%]" data-name="Vector" data-node-id="2047:14996" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[70.83%] left-1/2 opacity-60 right-1/4 top-[8.33%]" data-name="Vector" data-node-id="2047:14997" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[70.83%] left-3/4 opacity-0 right-0 top-[8.33%]" data-name="Vector" data-node-id="2047:14998" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-1/2 left-0 opacity-0 right-3/4 top-[29.17%]" data-name="Vector" data-node-id="2047:14999" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-1/2 left-1/4 opacity-60 right-1/2 top-[29.17%]" data-name="Vector" data-node-id="2047:15000" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-1/2 left-1/2 opacity-45 right-1/4 top-[29.17%]" data-name="Vector" data-node-id="2047:15001" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-1/2 left-3/4 opacity-30 right-0 top-[29.17%]" data-name="Vector" data-node-id="2047:15002" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[29.17%] left-0 opacity-60 right-3/4 top-1/2" data-name="Vector" data-node-id="2047:15003" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[29.17%] left-1/4 opacity-45 right-1/2 top-1/2" data-name="Vector" data-node-id="2047:15004" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[29.17%] left-1/2 opacity-30 right-1/4 top-1/2" data-name="Vector" data-node-id="2047:15005" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[29.17%] left-3/4 opacity-15 right-0 top-1/2" data-name="Vector" data-node-id="2047:15006" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[8.33%] left-0 opacity-0 right-3/4 top-[70.83%]" data-name="Vector" data-node-id="2047:15007" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[8.33%] left-1/4 opacity-30 right-1/2 top-[70.83%]" data-name="Vector" data-node-id="2047:15008" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[8.33%] left-1/2 opacity-15 right-1/4 top-[70.83%]" data-name="Vector" data-node-id="2047:15009" />
            <div className="absolute bg-[var(--colors\/blue-dark\/600,#155eef)] bottom-[8.33%] left-3/4 opacity-0 right-0 top-[70.83%]" data-name="Vector" data-node-id="2047:15010" />
          </>
        )}
      </div>
      {company === "3Portals" && style === "Default" && !darkMode && logotext && (
        <div className="h-[48px] relative shrink-0 w-[102px]" data-name="Logotext" data-node-id="2047:14266">
          <img alt="" className="absolute block max-w-none size-full" src={imgLogotext} />
        </div>
      )}
      {isKintsugiAndDefaultAndFalse && logotext && (
        <div className="h-[48px] relative shrink-0 w-[99px]" data-name="Logotext" data-node-id="2047:14846">
          <img alt="" className="absolute block max-w-none size-full" src={imgLogotext1} />
        </div>
      )}
      {isMagnoliaAndDefaultAndFalse && logotext && (
        <div className="h-[48px] relative shrink-0 w-[125px]" data-name="Logotext" data-node-id="2047:14956">
          <img alt="" className="absolute block max-w-none size-full" src={imgLogotext2} />
        </div>
      )}
      {isOdeaoLabsAndDefaultAndFalse && logotext && (
        <div className="h-[48px] relative shrink-0 w-[140px]" data-name="Logotext" data-node-id="2047:15011">
          <img alt="" className="absolute block max-w-none size-full" src={imgLogotext3} />
        </div>
      )}
      {isSisyphusAndDefaultAndFalse && logotext && (
        <div className="h-[48px] relative shrink-0 w-[115px]" data-name="Logotext" data-node-id="2047:15325">
          <img alt="" className="absolute block max-w-none size-full" src={imgLogotext4} />
        </div>
      )}
      {isStack3DLabAndDefaultAndFalse && logotext && (
        <div className="h-[48px] relative shrink-0 w-[149px]" data-name="Logotext" data-node-id="2047:15383">
          <img alt="" className="absolute block max-w-none size-full" src={imgLogotext5} />
        </div>
      )}
      {isWarpspeedAndDefaultAndFalse && logotext && (
        <div className="h-[48px] relative shrink-0 w-[143px]" data-name="Logotext" data-node-id="2047:15454">
          <img alt="" className="absolute block max-w-none size-full" src={imgLogotext6} />
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const [activeTab, setActiveTab] = React.useState<0 | 1 | 2>(0);

  const tabGraphics = [
    imgGeminiGeneratedImageIoc2Daioc2Daioc21,
    imgTabImage2,
    imgTabImage3
  ];

  return (
    <div className="bg-[#fafbfc] content-stretch flex flex-col items-start relative size-full" data-name="Landing" data-node-id="2007:22731">
      <div className="-translate-x-1/2 absolute h-[1440px] left-1/2 top-0 w-[1920px]" data-name="Background pattern" data-node-id="2047:22656">
        <img alt="" className="absolute inset-0 max-w-none size-full object-cover opacity-80" src="/figma-assets/background-pattern.png" />
      </div>
      <div className="content-stretch flex flex-col gap-[64px] items-center pt-[96px] relative shrink-0 w-full" data-name="Section" data-node-id="2047:5196">
        <div className="content-stretch flex flex-col gap-0 items-center max-w-[1280px] pl-[32px] pr-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="2047:5197">
          <div className="content-stretch flex flex-col gap-[48px] items-center relative shrink-0 w-full" data-name="Content" data-node-id="2047:5198">
            <div className="content-stretch flex flex-col gap-[24px] items-center max-w-[768px] relative shrink-0 text-center w-full" data-name="Heading and supporting text" data-node-id="2047:5199">
              <div className="content-stretch flex flex-col font-semibold gap-[12px] items-center relative shrink-0 w-full" data-name="Heading and subheading" data-node-id="2047:5200">
                <FadeIn delay={0}>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2047:5201">
                    Backed by Fruition | monday.com Platinum Partners
                  </p>
                </FadeIn>
                <FadeUp delay={0.1}>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/display-2xl,90px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/display-2xl,72px)] tracking-[-1.44px] w-full whitespace-pre-wrap" data-node-id="2047:5202">
                    {`Discover, Decide, `}
                    <br aria-hidden="true" />
                    {`Deploy, Done. `}
                  </p>
                </FadeUp>
              </div>
              <FadeUp delay={0.2}>
                <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-xl,30px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-xl,20px)] w-full" data-node-id="2047:5203" style={{ fontVariationSettings: "'opsz' 14" }}>
                  AI-powered marketplace that matches businesses with the right software solutions and the vetted experts to implement them successfully.
                </p>
              </FadeUp>
            </div>
            <FadeUp delay={0.3}>
              <div className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Email capture" data-node-id="2067:6075">
                <InputField className="w-[480px] shrink-0" />
                <Button
                  variant="primary"
                  size="lg"
                  leadingIcon={
                    <div className="overflow-clip relative size-[20px]">
                      <div className="absolute inset-[12.5%]">
                        <div className="absolute inset-[-5.56%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon2} />
                        </div>
                      </div>
                    </div>
                  }
                >
                  Find Your Software
                </Button>
            </div>
            </FadeUp>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center overflow-clip pl-[32px] pr-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="2047:5207">
          <div className="h-[400px] relative shrink-0 w-full" data-name="Content" data-node-id="2047:5208">
            <div className="absolute h-[390px] left-1/2 -translate-x-1/2 top-[9px] w-[1440px]" data-name="Container 1" data-node-id="2122:16944">
              <FadeIn delay={0.4}>
                <div className="absolute inset-0 mix-blend-darken overflow-hidden pointer-events-none">
                  <motion.img alt="" className="absolute h-[102.58%] left-0 max-w-none top-[-2.32%] w-full" src={imgContainer1} whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }} />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--colors\/background\/bg-secondary,#fafafa)] content-stretch flex items-start justify-center py-[96px] relative shrink-0 w-full" data-name="Social proof section" data-node-id="2047:22802">
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start max-w-[1280px] min-h-px min-w-px px-[32px] relative" data-name="Container" data-node-id="I2047:22802;1294:160624">
          <FadeUp delay={0}>
            <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] text-center whitespace-nowrap w-full" data-node-id="I2047:22802;1294:160625" style={{ fontVariationSettings: "'opsz' 14" }}>
              Join 4,000+ companies already growing
            </p>
          </FadeUp>
          <div className="overflow-hidden relative shrink-0 w-full" data-name="Logos" data-node-id="I2047:22802;1294:160699">
            <div className="flex gap-[24px] items-center animate-[marquee_20s_linear_infinite]" style={{ width: 'max-content' }}>
              {/* Original logos */}
              <CompanyLogo className="content-stretch flex gap-[10px] h-[48px] items-start relative shrink-0" company="OdeaoLabs" />
              <CompanyLogo className="content-stretch flex gap-[8px] h-[48px] items-start relative shrink-0" company="Kintsugi" />
              <CompanyLogo className="content-stretch flex gap-[10px] h-[48px] items-start relative shrink-0" company="Stack3d Lab" />
              <CompanyLogo className="content-stretch flex gap-[8px] h-[48px] items-start relative shrink-0" company="Magnolia" />
              <CompanyLogo className="content-stretch flex gap-[10px] h-[48px] items-start relative shrink-0" company="Warpspeed" />
              <CompanyLogo className="content-stretch flex gap-[10px] h-[48px] items-center relative shrink-0" company="Sisyphus" />
              {/* Duplicated logos for seamless loop */}
              <CompanyLogo className="content-stretch flex gap-[10px] h-[48px] items-start relative shrink-0" company="OdeaoLabs" />
              <CompanyLogo className="content-stretch flex gap-[8px] h-[48px] items-start relative shrink-0" company="Kintsugi" />
              <CompanyLogo className="content-stretch flex gap-[10px] h-[48px] items-start relative shrink-0" company="Stack3d Lab" />
              <CompanyLogo className="content-stretch flex gap-[8px] h-[48px] items-start relative shrink-0" company="Magnolia" />
              <CompanyLogo className="content-stretch flex gap-[10px] h-[48px] items-start relative shrink-0" company="Warpspeed" />
              <CompanyLogo className="content-stretch flex gap-[10px] h-[48px] items-center relative shrink-0" company="Sisyphus" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--colors\/background\/bg-primary,white)] content-stretch flex flex-col gap-[64px] items-center overflow-clip py-[96px] relative shrink-0 w-full" data-name="Features section" data-node-id="2075:7476">
        <div className="content-stretch flex flex-col gap-0 items-start max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="2075:7477">
          <div className="content-stretch flex flex-col gap-0 items-start relative shrink-0 w-full" data-name="Content" data-node-id="2075:7478">
            <div className="content-stretch flex flex-col gap-[20px] items-start max-w-[768px] relative shrink-0 w-full" data-name="Heading and supporting text" data-node-id="2075:7479">
              <div className="content-stretch flex flex-col font-semibold gap-[12px] items-start relative shrink-0 w-full" data-name="Heading and subheading" data-node-id="2075:7480">
                <FadeIn delay={0}>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2075:7481">
                    Why Work With Us
                  </p>
                </FadeIn>
                <FadeUp delay={0.1}>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/display-md,44px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/display-md,36px)] tracking-[-0.72px] w-full" data-node-id="2075:7482">
                    Centralise procurement with complete visibility
                  </p>
                </FadeUp>
              </div>
              <FadeUp delay={0.2}>
                <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-xl,30px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-xl,20px)] w-full" data-node-id="2075:7483" style={{ fontVariationSettings: "’opsz’ 14" }}>{`Because the right tools aren’t enough, you need the right experts. `}</p>
              </FadeUp>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[64px] items-center max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="2075:7484">
          <FadeUp delay={0.1}>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start max-w-[560px] min-h-px min-w-px relative" data-name="Content" data-node-id="2075:7485">
              <button onClick={() => setActiveTab(0)} className={`border-l-4 border-solid content-stretch flex flex-col gap-[16px] items-start pl-[24px] py-[16px] relative shrink-0 w-full cursor-pointer transition-colors ${activeTab === 0 ? 'border-[#2970ff]' : 'border-[#f5f5f5]'}`} data-name="_Feature tab" data-node-id="2075:7486">
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Text and supporting text" data-node-id="I2075:7486;3285:387427">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-left w-full" data-node-id="I2075:7486;3285:387428">
                  Improve Implementation Success Assurance
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] text-left w-full" data-node-id="I2075:7486;3285:387429" style={{ fontVariationSettings: "'opsz' 14" }}>
                  Accelerate vendor evaluation by eliminating lengthy RFP cycles and manual comparisons. Gain immediate access to pre-qualified solutions matched to your operational needs
                </p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center justify-start overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2075:7486;3287:476535">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2075:7486;3287:476535;3287:433317">
                  Learn more
                </p>
                <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2075:7486;3287:476535;3468:568384">
                  <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2075:7486;3287:476535;3468:568384;3463:404483">
                    <div className="absolute inset-[-7.14%]">
                      <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </button>
            <button onClick={() => setActiveTab(1)} className={`border-l-4 border-solid content-stretch flex flex-col gap-[16px] items-start pl-[24px] py-[16px] relative shrink-0 w-full cursor-pointer transition-colors ${activeTab === 1 ? 'border-[#2970ff]' : 'border-[#f5f5f5]'}`} data-name="_Feature tab" data-node-id="2075:7487">
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Text and supporting text" data-node-id="I2075:7487;3285:387418">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-left w-full" data-node-id="I2075:7487;3285:387419">
                  Maximise Return on Technology Investments
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] text-left w-full" data-node-id="I2075:7487;3285:387420" style={{ fontVariationSettings: "'opsz' 14" }}>
                  An all-in-one customer service platform that helps you balance everything your customers need to be happy.
                </p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center justify-start overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2075:7487;3287:476536">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2075:7487;3287:476536;3287:433317">
                  Learn more
                </p>
                <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2075:7487;3287:476536;3468:568384">
                  <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2075:7487;3287:476536;3468:568384;3463:404483">
                    <div className="absolute inset-[-7.14%]">
                      <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                    </div>
                  </div>
                </motion.div>
              </div>
              </button>
            <button onClick={() => setActiveTab(2)} className={`border-l-4 border-solid content-stretch flex flex-col gap-[16px] items-start pl-[24px] py-[16px] relative shrink-0 w-full cursor-pointer transition-colors ${activeTab === 2 ? 'border-[#2970ff]' : 'border-[#f5f5f5]'}`} data-name="_Feature tab" data-node-id="2075:7488">
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Text and supporting text" data-node-id="I2075:7488;3285:387418">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-left w-full" data-node-id="I2075:7488;3285:387419">
                  Strengthen Cost Control Measures
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] text-left w-full" data-node-id="I2075:7488;3285:387420" style={{ fontVariationSettings: "'opsz' 14" }}>
                  Measure what matters with easy-to-use reports. Filter, export, and drilldown on the data in a couple clicks.
                </p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center justify-start overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2075:7488;3287:476536">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2075:7488;3287:476536;3287:433317">
                  Learn more
                </p>
                <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2075:7488;3287:476536;3468:568384">
                  <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2075:7488;3287:476536;3468:568384;3463:404483">
                    <div className="absolute inset-[-7.14%]">
                      <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </button>
            </div>
          </FadeUp>
          <div className="flex-[1_0_0] h-[640px] min-h-px min-w-px overflow-visible relative" data-name="Content" data-node-id="2075:7489">
            <div className="-translate-y-1/2 absolute h-[640px] left-0 overflow-visible top-1/2 w-[576px]" data-name="Cards wrap" data-node-id="2075:7490">
              <div className="absolute aspect-[2354/1824] left-[-7.12%] right-[-3.65%] top-[73px] overflow-visible" data-name="Feature image" data-node-id="2078:7558">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeTab}
                    alt=""
                    className="absolute inset-0 max-w-none mix-blend-darken object-contain pointer-events-none size-full"
                    style={{ scale: [0.81, 1.215, 0.81][activeTab] }}
                    src={tabGraphics[activeTab]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--colors\/background\/bg-primary,white)] content-stretch flex flex-col gap-[64px] items-center overflow-clip pb-[96px] pt-[96px] relative shrink-0 w-full" data-name="Features section" data-node-id="2082:8049">
        <div className="content-stretch flex flex-col gap-0 items-start max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="2082:8050">
          <div className="content-stretch flex flex-col gap-0 items-center relative shrink-0 w-full" data-name="Content" data-node-id="2082:8051">
            <div className="content-stretch flex flex-col gap-[20px] items-center max-w-[768px] relative shrink-0 w-full" data-name="Heading and supporting text" data-node-id="2082:8052">
              <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-name="Heading and badge" data-node-id="2082:8053">
                <FadeIn delay={0}>
                <div className="bg-[var(--component-colors\/utility\/brand\/utility-brand-50,#eff4ff)] border border-[var(--component-colors\/utility\/brand\/utility-brand-200,#b2ccff)] border-solid content-stretch flex items-center px-[12px] py-[4px] relative rounded-full shrink-0" data-name="Badge" data-node-id="2082:8054">
                  <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--component-colors\/utility\/brand\/utility-brand-700,#004eeb)] text-[length:var(--font-size\/text-sm,14px)] text-center whitespace-nowrap" data-node-id="I2082:8054;3918:415074" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Explore by Category
                  </p>
                </div>
                </FadeIn>
                <FadeUp delay={0}>
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/display-md,44px)] min-w-full relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/display-md,36px)] text-center tracking-[-0.72px]" data-node-id="2082:8055">
                  Software Solutions by Industry
                </p>
                </FadeUp>
              </div>
              <FadeUp delay={0}>
              <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-xl,30px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-xl,20px)] text-center w-full" data-node-id="2082:8056" style={{ fontVariationSettings: "'opsz' 14" }}>
                Discover specialised tools tailored to your business needs across 5+ major industries.
              </p>
              </FadeUp>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-0 items-start max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="2082:8057">
          <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full" data-name="Cards" data-node-id="2096:21949">
            <div className="absolute content-stretch flex flex-col inset-0 items-start pointer-events-none" data-name="Gradient mask" data-node-id="2096:21950" style={{ display: 'none' }}>
              <div className="bg-black flex-[1_0_0] min-h-px min-w-px w-full" data-name="Gradient mask main" data-node-id="2096:21951" />
              <div className="h-[200px] shrink-0 w-full" data-name="Gradient mask bottom" data-node-id="2096:21952" style={{ backgroundImage: "linear-gradient(1.13908e-07deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.008) 8.0687%, rgba(0, 0, 0, 0.024) 15.537%, rgba(0, 0, 0, 0.047) 22.496%, rgba(0, 0, 0, 0.086) 29.039%, rgba(0, 0, 0, 0.13) 35.259%, rgba(0, 0, 0, 0.184) 41.248%, rgba(0, 0, 0, 0.247) 47.098%, rgba(0, 0, 0, 0.318) 52.902%, rgba(0, 0, 0, 0.396) 58.752%, rgba(0, 0, 0, 0.482) 64.741%, rgba(0, 0, 0, 0.576) 70.961%, rgba(0, 0, 0, 0.675) 77.504%, rgba(0, 0, 0, 0.776) 84.463%, rgba(0, 0, 0, 0.886) 91.931%, rgb(0, 0, 0) 100%)" }} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px min-w-px relative" data-name="Column" data-node-id="2096:21953">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", filter: 'brightness(0.97)' }}
                transition={{ duration: 0.2, delay: 0 }}
                viewport={{ once: true, margin: "-80px" }}
              >
              <div className="bg-[var(--colors\/background\/bg-primary_alt,white)] border border-[var(--colors\/border\/border-secondary,#e9eaeb)] border-solid content-stretch flex flex-col gap-[36px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="Card" data-node-id="2096:21954">
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="2096:21955">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="2096:21956">
                    <div className="bg-[var(--colors\/background\/bg-primary,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid overflow-clip relative rounded-[10px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0 size-[48px]" data-name="Featured icon" data-node-id="2096:21957">
                      <div className="absolute content-stretch flex gap-[6.776px] items-start left-[9px] top-[7px]" data-name="Company logo" data-node-id="2096:21958">
                        <div className="h-[32.526px] relative shrink-0 w-[27.105px]" data-name="Logomark" data-node-id="I2096:21958;7531:71188">
                          <img alt="" className="absolute block max-w-none size-full" src={imgLogomark6} />
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
                    </div>
                    <div className="bg-[var(--component-colors\/utility\/blue\/utility-blue-50,#eff8ff)] border border-[var(--component-colors\/utility\/blue\/utility-blue-200,#b2ddff)] border-solid content-stretch flex gap-[6px] items-center pl-[8px] pr-[10px] py-[2px] relative rounded-full shrink-0" data-name="Badge" data-node-id="2096:21959">
                      <div className="relative shrink-0 size-[8px]" data-name="_Dot" data-node-id="I2096:21959;3918:414119">
                        <div className="absolute left-px size-[6px] top-px" data-name="Dot" data-node-id="I2096:21959;3918:414119;1046:12312">
                          <img alt="" className="absolute block max-w-none size-full" src={imgDot} />
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--component-colors\/utility\/blue\/utility-blue-700,#175cd3)] text-[length:var(--font-size\/text-sm,14px)] text-center whitespace-nowrap" data-node-id="I2096:21959;3918:414120" style={{ fontVariationSettings: "'opsz' 14" }}>
                        +24% Sales Increase
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-center whitespace-nowrap" data-node-id="2096:21960">
                    The Product Name
                  </p>
                  <div className="content-stretch flex flex-col gap-0 items-start relative shrink-0 w-full" data-name="Logo and text" data-node-id="2096:21961">
                    <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2096:21962" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2096:21963">
                  <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Avatar group" data-node-id="2096:21964">
                    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Avatars" data-node-id="I2096:21964;1274:814">
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:21964;1274:816">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#cfcbdc] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:21964;1274:818">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d6cfb7] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar1} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:21964;1274:820">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d7e3e8] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar2} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="2096:21965">
                    <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-sm,14px)] whitespace-nowrap" data-node-id="I2096:21965;3287:433289">
                      Learn More
                    </p>
                    <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2096:21965;3468:557561">
                      <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2096:21965;3468:557561;3463:404483">
                        <div className="absolute inset-[-7.14%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", filter: 'brightness(0.97)' }}
                transition={{ duration: 0.2, delay: 0.05 }}
                viewport={{ once: true, margin: "-80px" }}
              >
              <div className="bg-[var(--colors\/background\/bg-primary_alt,white)] border border-[var(--colors\/border\/border-secondary,#e9eaeb)] border-solid content-stretch flex flex-col gap-[36px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="Card" data-node-id="2096:21966">
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="2096:21967">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="2096:21968">
                    <div className="bg-[var(--colors\/background\/bg-primary,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid overflow-clip relative rounded-[10px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0 size-[48px]" data-name="Featured icon" data-node-id="2096:21969">
                      <div className="absolute content-stretch flex gap-[6.776px] items-start left-[9px] top-[7px]" data-name="Company logo" data-node-id="2096:21970">
                        <div className="h-[32.526px] relative shrink-0 w-[27.105px]" data-name="Logomark" data-node-id="I2096:21970;7531:71188">
                          <img alt="" className="absolute block max-w-none size-full" src={imgLogomark6} />
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
                    </div>
                    <div className="bg-[var(--component-colors\/utility\/blue\/utility-blue-50,#eff8ff)] border border-[var(--component-colors\/utility\/blue\/utility-blue-200,#b2ddff)] border-solid content-stretch flex gap-[6px] items-center pl-[8px] pr-[10px] py-[2px] relative rounded-full shrink-0" data-name="Badge" data-node-id="2096:21971">
                      <div className="relative shrink-0 size-[8px]" data-name="_Dot" data-node-id="I2096:21971;3918:414119">
                        <div className="absolute left-px size-[6px] top-px" data-name="Dot" data-node-id="I2096:21971;3918:414119;1046:12312">
                          <img alt="" className="absolute block max-w-none size-full" src={imgDot} />
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--component-colors\/utility\/blue\/utility-blue-700,#175cd3)] text-[length:var(--font-size\/text-sm,14px)] text-center whitespace-nowrap" data-node-id="I2096:21971;3918:414120" style={{ fontVariationSettings: "'opsz' 14" }}>
                        +24% Sales Increase
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-center whitespace-nowrap" data-node-id="2096:21972">
                    The Product Name
                  </p>
                  <div className="content-stretch flex flex-col gap-0 items-start relative shrink-0 w-full" data-name="Logo and text" data-node-id="2096:21973">
                    <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2096:21974" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2096:21975">
                  <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Avatar group" data-node-id="2096:21976">
                    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Avatars" data-node-id="I2096:21976;1274:814">
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:21976;1274:816">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#cfcbdc] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:21976;1274:818">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d6cfb7] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar1} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:21976;1274:820">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d7e3e8] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar2} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="2096:21977">
                    <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-sm,14px)] whitespace-nowrap" data-node-id="I2096:21977;3287:433289">
                      Learn More
                    </p>
                    <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2096:21977;3468:557561">
                      <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2096:21977;3468:557561;3463:404483">
                        <div className="absolute inset-[-7.14%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", filter: 'brightness(0.97)' }}
                transition={{ duration: 0.2, delay: 0.1 }}
                viewport={{ once: true, margin: "-80px" }}
              >
              <div className="bg-[var(--colors\/background\/bg-primary_alt,white)] border border-[var(--colors\/border\/border-secondary,#e9eaeb)] border-solid content-stretch flex flex-col gap-[48px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="Card" data-node-id="2096:22002">
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="2096:22003">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="2096:22004">
                    <div className="bg-[var(--colors\/background\/bg-primary,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid overflow-clip relative rounded-[10px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0 size-[48px]" data-name="Featured icon" data-node-id="2096:22005">
                      <div className="absolute content-stretch flex gap-[6.776px] items-start left-[9px] top-[7px]" data-name="Company logo" data-node-id="2096:22006">
                        <div className="h-[32.526px] relative shrink-0 w-[27.105px]" data-name="Logomark" data-node-id="I2096:22006;7531:71188">
                          <img alt="" className="absolute block max-w-none size-full" src={imgLogomark6} />
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
                    </div>
                    <div className="bg-[var(--component-colors\/utility\/blue\/utility-blue-50,#eff8ff)] border border-[var(--component-colors\/utility\/blue\/utility-blue-200,#b2ddff)] border-solid content-stretch flex gap-[6px] items-center pl-[8px] pr-[10px] py-[2px] relative rounded-full shrink-0" data-name="Badge" data-node-id="2096:22007">
                      <div className="relative shrink-0 size-[8px]" data-name="_Dot" data-node-id="I2096:22007;3918:414119">
                        <div className="absolute left-px size-[6px] top-px" data-name="Dot" data-node-id="I2096:22007;3918:414119;1046:12312">
                          <img alt="" className="absolute block max-w-none size-full" src={imgDot} />
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--component-colors\/utility\/blue\/utility-blue-700,#175cd3)] text-[length:var(--font-size\/text-sm,14px)] text-center whitespace-nowrap" data-node-id="I2096:22007;3918:414120" style={{ fontVariationSettings: "'opsz' 14" }}>
                        +24% Sales Increase
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-center whitespace-nowrap" data-node-id="2096:22008">
                    The Product Name
                  </p>
                  <div className="content-stretch flex flex-col gap-0 items-start relative shrink-0 w-full" data-name="Logo and text" data-node-id="2096:22009">
                    <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2096:22010" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2096:22011">
                  <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Avatar group" data-node-id="2096:22012">
                    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Avatars" data-node-id="I2096:22012;1274:814">
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22012;1274:816">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#cfcbdc] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22012;1274:818">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d6cfb7] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar1} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22012;1274:820">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d7e3e8] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar2} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="2096:22013">
                    <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-sm,14px)] whitespace-nowrap" data-node-id="I2096:22013;3287:433289">
                      Learn More
                    </p>
                    <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2096:22013;3468:557561">
                      <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2096:22013;3468:557561;3463:404483">
                        <div className="absolute inset-[-7.14%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px min-w-px relative" data-name="Column" data-node-id="2096:22014">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", filter: 'brightness(0.97)' }}
                transition={{ duration: 0.2, delay: 0.15 }}
                viewport={{ once: true, margin: "-80px" }}
              >
              <div className="bg-[var(--colors\/background\/bg-primary_alt,white)] border border-[var(--colors\/border\/border-secondary,#e9eaeb)] border-solid content-stretch flex flex-col gap-[36px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="Card" data-node-id="2096:22015">
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="2096:22016">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="2096:22017">
                    <div className="bg-[var(--colors\/background\/bg-primary,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid overflow-clip relative rounded-[10px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0 size-[48px]" data-name="Featured icon" data-node-id="2096:22018">
                      <div className="absolute content-stretch flex gap-[6.776px] items-start left-[9px] top-[7px]" data-name="Company logo" data-node-id="2096:22019">
                        <div className="h-[32.526px] relative shrink-0 w-[27.105px]" data-name="Logomark" data-node-id="I2096:22019;7531:71188">
                          <img alt="" className="absolute block max-w-none size-full" src={imgLogomark6} />
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
                    </div>
                    <div className="bg-[var(--component-colors\/utility\/blue\/utility-blue-50,#eff8ff)] border border-[var(--component-colors\/utility\/blue\/utility-blue-200,#b2ddff)] border-solid content-stretch flex gap-[6px] items-center pl-[8px] pr-[10px] py-[2px] relative rounded-full shrink-0" data-name="Badge" data-node-id="2096:22020">
                      <div className="relative shrink-0 size-[8px]" data-name="_Dot" data-node-id="I2096:22020;3918:414119">
                        <div className="absolute left-px size-[6px] top-px" data-name="Dot" data-node-id="I2096:22020;3918:414119;1046:12312">
                          <img alt="" className="absolute block max-w-none size-full" src={imgDot} />
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--component-colors\/utility\/blue\/utility-blue-700,#175cd3)] text-[length:var(--font-size\/text-sm,14px)] text-center whitespace-nowrap" data-node-id="I2096:22020;3918:414120" style={{ fontVariationSettings: "'opsz' 14" }}>
                        +24% Sales Increase
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-center whitespace-nowrap" data-node-id="2096:22021">
                    The Product Name
                  </p>
                  <div className="content-stretch flex flex-col gap-0 items-start relative shrink-0 w-full" data-name="Logo and text" data-node-id="2096:22022">
                    <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2096:22023" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2096:22024">
                  <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Avatar group" data-node-id="2096:22025">
                    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Avatars" data-node-id="I2096:22025;1274:814">
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22025;1274:816">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#cfcbdc] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22025;1274:818">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d6cfb7] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar1} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22025;1274:820">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d7e3e8] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar2} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="2096:22026">
                    <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-sm,14px)] whitespace-nowrap" data-node-id="I2096:22026;3287:433289">
                      Learn More
                    </p>
                    <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2096:22026;3468:557561">
                      <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2096:22026;3468:557561;3463:404483">
                        <div className="absolute inset-[-7.14%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", filter: 'brightness(0.97)' }}
                transition={{ duration: 0.2, delay: 0.2 }}
                viewport={{ once: true, margin: "-80px" }}
              >
              <div className="bg-[var(--colors\/background\/bg-primary_alt,white)] border border-[var(--colors\/border\/border-secondary,#e9eaeb)] border-solid content-stretch flex flex-col gap-[36px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="Card" data-node-id="2096:22027">
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="2096:22028">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="2096:22029">
                    <div className="bg-[var(--colors\/background\/bg-primary,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid overflow-clip relative rounded-[10px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0 size-[48px]" data-name="Featured icon" data-node-id="2096:22030">
                      <div className="absolute content-stretch flex gap-[6.776px] items-start left-[9px] top-[7px]" data-name="Company logo" data-node-id="2096:22031">
                        <div className="h-[32.526px] relative shrink-0 w-[27.105px]" data-name="Logomark" data-node-id="I2096:22031;7531:71188">
                          <img alt="" className="absolute block max-w-none size-full" src={imgLogomark6} />
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
                    </div>
                    <div className="bg-[var(--component-colors\/utility\/blue\/utility-blue-50,#eff8ff)] border border-[var(--component-colors\/utility\/blue\/utility-blue-200,#b2ddff)] border-solid content-stretch flex gap-[6px] items-center pl-[8px] pr-[10px] py-[2px] relative rounded-full shrink-0" data-name="Badge" data-node-id="2096:22032">
                      <div className="relative shrink-0 size-[8px]" data-name="_Dot" data-node-id="I2096:22032;3918:414119">
                        <div className="absolute left-px size-[6px] top-px" data-name="Dot" data-node-id="I2096:22032;3918:414119;1046:12312">
                          <img alt="" className="absolute block max-w-none size-full" src={imgDot} />
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--component-colors\/utility\/blue\/utility-blue-700,#175cd3)] text-[length:var(--font-size\/text-sm,14px)] text-center whitespace-nowrap" data-node-id="I2096:22032;3918:414120" style={{ fontVariationSettings: "'opsz' 14" }}>
                        +24% Sales Increase
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-center whitespace-nowrap" data-node-id="2096:22033">
                    The Product Name
                  </p>
                  <div className="content-stretch flex flex-col gap-0 items-start relative shrink-0 w-full" data-name="Logo and text" data-node-id="2096:22034">
                    <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2096:22035" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2096:22036">
                  <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Avatar group" data-node-id="2096:22037">
                    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Avatars" data-node-id="I2096:22037;1274:814">
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22037;1274:816">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#cfcbdc] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22037;1274:818">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d6cfb7] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar1} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22037;1274:820">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d7e3e8] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar2} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="2096:22038">
                    <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-sm,14px)] whitespace-nowrap" data-node-id="I2096:22038;3287:433289">
                      Learn More
                    </p>
                    <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2096:22038;3468:557561">
                      <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2096:22038;3468:557561;3463:404483">
                        <div className="absolute inset-[-7.14%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", filter: 'brightness(0.97)' }}
                transition={{ duration: 0.2, delay: 0.25 }}
                viewport={{ once: true, margin: "-80px" }}
              >
              <div className="bg-[var(--colors\/background\/bg-primary_alt,white)] border border-[var(--colors\/border\/border-secondary,#e9eaeb)] border-solid content-stretch flex flex-col gap-[48px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="Card" data-node-id="2096:22063">
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="2096:22064">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="2096:22065">
                    <div className="bg-[var(--colors\/background\/bg-primary,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid overflow-clip relative rounded-[10px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0 size-[48px]" data-name="Featured icon" data-node-id="2096:22066">
                      <div className="absolute content-stretch flex gap-[6.776px] items-start left-[9px] top-[7px]" data-name="Company logo" data-node-id="2096:22067">
                        <div className="h-[32.526px] relative shrink-0 w-[27.105px]" data-name="Logomark" data-node-id="I2096:22067;7531:71188">
                          <img alt="" className="absolute block max-w-none size-full" src={imgLogomark6} />
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
                    </div>
                    <div className="bg-[var(--component-colors\/utility\/blue\/utility-blue-50,#eff8ff)] border border-[var(--component-colors\/utility\/blue\/utility-blue-200,#b2ddff)] border-solid content-stretch flex gap-[6px] items-center pl-[8px] pr-[10px] py-[2px] relative rounded-full shrink-0" data-name="Badge" data-node-id="2096:22068">
                      <div className="relative shrink-0 size-[8px]" data-name="_Dot" data-node-id="I2096:22068;3918:414119">
                        <div className="absolute left-px size-[6px] top-px" data-name="Dot" data-node-id="I2096:22068;3918:414119;1046:12312">
                          <img alt="" className="absolute block max-w-none size-full" src={imgDot} />
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--component-colors\/utility\/blue\/utility-blue-700,#175cd3)] text-[length:var(--font-size\/text-sm,14px)] text-center whitespace-nowrap" data-node-id="I2096:22068;3918:414120" style={{ fontVariationSettings: "'opsz' 14" }}>
                        +24% Sales Increase
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-center whitespace-nowrap" data-node-id="2096:22069">
                    The Product Name
                  </p>
                  <div className="content-stretch flex flex-col gap-0 items-start relative shrink-0 w-full" data-name="Logo and text" data-node-id="2096:22070">
                    <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2096:22071" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2096:22072">
                  <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Avatar group" data-node-id="2096:22073">
                    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Avatars" data-node-id="I2096:22073;1274:814">
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22073;1274:816">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#cfcbdc] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22073;1274:818">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d6cfb7] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar1} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22073;1274:820">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d7e3e8] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar2} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="2096:22074">
                    <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-sm,14px)] whitespace-nowrap" data-node-id="I2096:22074;3287:433289">
                      Learn More
                    </p>
                    <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2096:22074;3468:557561">
                      <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2096:22074;3468:557561;3463:404483">
                        <div className="absolute inset-[-7.14%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px min-w-px relative" data-name="Column" data-node-id="2096:22075">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", filter: 'brightness(0.97)' }}
                transition={{ duration: 0.2, delay: 0.3 }}
                viewport={{ once: true, margin: "-80px" }}
              >
              <div className="bg-[var(--colors\/background\/bg-primary_alt,white)] border border-[var(--colors\/border\/border-secondary,#e9eaeb)] border-solid content-stretch flex flex-col gap-[36px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="Card" data-node-id="2096:22076">
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="2096:22077">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="2096:22078">
                    <div className="bg-[var(--colors\/background\/bg-primary,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid overflow-clip relative rounded-[10px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0 size-[48px]" data-name="Featured icon" data-node-id="2096:22079">
                      <div className="absolute content-stretch flex gap-[6.776px] items-start left-[9px] top-[7px]" data-name="Company logo" data-node-id="2096:22080">
                        <div className="h-[32.526px] relative shrink-0 w-[27.105px]" data-name="Logomark" data-node-id="I2096:22080;7531:71188">
                          <img alt="" className="absolute block max-w-none size-full" src={imgLogomark6} />
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
                    </div>
                    <div className="bg-[var(--component-colors\/utility\/blue\/utility-blue-50,#eff8ff)] border border-[var(--component-colors\/utility\/blue\/utility-blue-200,#b2ddff)] border-solid content-stretch flex gap-[6px] items-center pl-[8px] pr-[10px] py-[2px] relative rounded-full shrink-0" data-name="Badge" data-node-id="2096:22081">
                      <div className="relative shrink-0 size-[8px]" data-name="_Dot" data-node-id="I2096:22081;3918:414119">
                        <div className="absolute left-px size-[6px] top-px" data-name="Dot" data-node-id="I2096:22081;3918:414119;1046:12312">
                          <img alt="" className="absolute block max-w-none size-full" src={imgDot} />
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--component-colors\/utility\/blue\/utility-blue-700,#175cd3)] text-[length:var(--font-size\/text-sm,14px)] text-center whitespace-nowrap" data-node-id="I2096:22081;3918:414120" style={{ fontVariationSettings: "'opsz' 14" }}>
                        +24% Sales Increase
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-center whitespace-nowrap" data-node-id="2096:22082">
                    The Product Name
                  </p>
                  <div className="content-stretch flex flex-col gap-0 items-start relative shrink-0 w-full" data-name="Logo and text" data-node-id="2096:22083">
                    <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2096:22084" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2096:22085">
                  <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Avatar group" data-node-id="2096:22086">
                    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Avatars" data-node-id="I2096:22086;1274:814">
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22086;1274:816">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#cfcbdc] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22086;1274:818">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d6cfb7] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar1} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22086;1274:820">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d7e3e8] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar2} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="2096:22087">
                    <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-sm,14px)] whitespace-nowrap" data-node-id="I2096:22087;3287:433289">
                      Learn More
                    </p>
                    <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2096:22087;3468:557561">
                      <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2096:22087;3468:557561;3463:404483">
                        <div className="absolute inset-[-7.14%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", filter: 'brightness(0.97)' }}
                transition={{ duration: 0.2, delay: 0.35 }}
                viewport={{ once: true, margin: "-80px" }}
              >
              <div className="bg-[var(--colors\/background\/bg-primary_alt,white)] border border-[var(--colors\/border\/border-secondary,#e9eaeb)] border-solid content-stretch flex flex-col gap-[36px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="Card" data-node-id="2096:22088">
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="2096:22089">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="2096:22090">
                    <div className="bg-[var(--colors\/background\/bg-primary,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid overflow-clip relative rounded-[10px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0 size-[48px]" data-name="Featured icon" data-node-id="2096:22091">
                      <div className="absolute content-stretch flex gap-[6.776px] items-start left-[9px] top-[7px]" data-name="Company logo" data-node-id="2096:22092">
                        <div className="h-[32.526px] relative shrink-0 w-[27.105px]" data-name="Logomark" data-node-id="I2096:22092;7531:71188">
                          <img alt="" className="absolute block max-w-none size-full" src={imgLogomark6} />
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
                    </div>
                    <div className="bg-[var(--component-colors\/utility\/blue\/utility-blue-50,#eff8ff)] border border-[var(--component-colors\/utility\/blue\/utility-blue-200,#b2ddff)] border-solid content-stretch flex gap-[6px] items-center pl-[8px] pr-[10px] py-[2px] relative rounded-full shrink-0" data-name="Badge" data-node-id="2096:22093">
                      <div className="relative shrink-0 size-[8px]" data-name="_Dot" data-node-id="I2096:22093;3918:414119">
                        <div className="absolute left-px size-[6px] top-px" data-name="Dot" data-node-id="I2096:22093;3918:414119;1046:12312">
                          <img alt="" className="absolute block max-w-none size-full" src={imgDot} />
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--component-colors\/utility\/blue\/utility-blue-700,#175cd3)] text-[length:var(--font-size\/text-sm,14px)] text-center whitespace-nowrap" data-node-id="I2096:22093;3918:414120" style={{ fontVariationSettings: "'opsz' 14" }}>
                        +24% Sales Increase
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-center whitespace-nowrap" data-node-id="2096:22094">
                    The Product Name
                  </p>
                  <div className="content-stretch flex flex-col gap-0 items-start relative shrink-0 w-full" data-name="Logo and text" data-node-id="2096:22095">
                    <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2096:22096" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2096:22097">
                  <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Avatar group" data-node-id="2096:22098">
                    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Avatars" data-node-id="I2096:22098;1274:814">
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22098;1274:816">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#cfcbdc] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22098;1274:818">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d6cfb7] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar1} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22098;1274:820">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d7e3e8] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar2} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="2096:22099">
                    <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-sm,14px)] whitespace-nowrap" data-node-id="I2096:22099;3287:433289">
                      Learn More
                    </p>
                    <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2096:22099;3468:557561">
                      <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2096:22099;3468:557561;3463:404483">
                        <div className="absolute inset-[-7.14%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", filter: 'brightness(0.97)' }}
                transition={{ duration: 0.2, delay: 0.4 }}
                viewport={{ once: true, margin: "-80px" }}
              >
              <div className="bg-[var(--colors\/background\/bg-primary_alt,white)] border border-[var(--colors\/border\/border-secondary,#e9eaeb)] border-solid content-stretch flex flex-col gap-[48px] items-start p-[32px] relative rounded-[12px] shrink-0 w-full" data-name="Card" data-node-id="2096:22124">
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="2096:22125">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="2096:22126">
                    <div className="bg-[var(--colors\/background\/bg-primary,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid overflow-clip relative rounded-[10px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0 size-[48px]" data-name="Featured icon" data-node-id="2096:22127">
                      <div className="absolute content-stretch flex gap-[6.776px] items-start left-[9px] top-[7px]" data-name="Company logo" data-node-id="2096:22128">
                        <div className="h-[32.526px] relative shrink-0 w-[27.105px]" data-name="Logomark" data-node-id="I2096:22128;7531:71188">
                          <img alt="" className="absolute block max-w-none size-full" src={imgLogomark6} />
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner-border,rgba(10,13,18,0.18)),inset_0px_-2px_0px_0px_var(--colors\/effects\/shadows\/shadow-skeumorphic-inner,rgba(10,13,18,0.05))]" />
                    </div>
                    <div className="bg-[var(--component-colors\/utility\/blue\/utility-blue-50,#eff8ff)] border border-[var(--component-colors\/utility\/blue\/utility-blue-200,#b2ddff)] border-solid content-stretch flex gap-[6px] items-center pl-[8px] pr-[10px] py-[2px] relative rounded-full shrink-0" data-name="Badge" data-node-id="2096:22129">
                      <div className="relative shrink-0 size-[8px]" data-name="_Dot" data-node-id="I2096:22129;3918:414119">
                        <div className="absolute left-px size-[6px] top-px" data-name="Dot" data-node-id="I2096:22129;3918:414119;1046:12312">
                          <img alt="" className="absolute block max-w-none size-full" src={imgDot} />
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-dm-sans)] font-medium leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--component-colors\/utility\/blue\/utility-blue-700,#175cd3)] text-[length:var(--font-size\/text-sm,14px)] text-center whitespace-nowrap" data-node-id="I2096:22129;3918:414120" style={{ fontVariationSettings: "'opsz' 14" }}>
                        +24% Sales Increase
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/text-lg,18px)] text-center whitespace-nowrap" data-node-id="2096:22130">
                    The Product Name
                  </p>
                  <div className="content-stretch flex flex-col gap-0 items-start relative shrink-0 w-full" data-name="Logo and text" data-node-id="2096:22131">
                    <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="2096:22132" style={{ fontVariationSettings: "'opsz' 14" }}>
                      Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2096:22133">
                  <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Avatar group" data-node-id="2096:22134">
                    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Avatars" data-node-id="I2096:22134;1274:814">
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22134;1274:816">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#cfcbdc] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22134;1274:818">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d6cfb7] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar1} />
                        </div>
                      </div>
                      <div className="border-[0.75px] border-[rgba(0,0,0,0.08)] border-solid mr-[-8px] relative rounded-full shadow-[0px_0px_0px_1.5px_var(--colors\/background\/bg-primary,white)] shrink-0 size-[32px]" data-name="Avatar" data-node-id="I2096:22134;1274:820">
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-full">
                          <div className="absolute bg-[#d7e3e8] inset-0 rounded-full" />
                          <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar2} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="2096:22135">
                    <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-sm,14px)] whitespace-nowrap" data-node-id="I2096:22135;3287:433289">
                      Learn More
                    </p>
                    <motion.div whileHover={{ x: 4 }} className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right" data-node-id="I2096:22135;3468:557561">
                      <div className="absolute inset-[20.83%]" data-name="Icon" data-node-id="I2096:22135;3468:557561;3463:404483">
                        <div className="absolute inset-[-7.14%]">
                          <img alt="" className="block max-w-none size-full" src={imgIcon3} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--colors\/background\/bg-primary,white)] content-stretch flex flex-col gap-[96px] items-center overflow-clip pb-[160px] pt-[96px] relative shrink-0 w-full" data-name="Features section" data-node-id="2047:25841">
        <div className="content-stretch flex flex-col gap-0 items-start max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="I2047:25841;1327:181071">
          <div className="content-stretch flex flex-col gap-0 items-center relative shrink-0 w-full" data-name="Content" data-node-id="I2047:25841;1327:181072">
            <div className="content-stretch flex flex-col gap-[20px] items-center max-w-[768px] relative shrink-0 text-center w-full" data-name="Heading and supporting text" data-node-id="I2047:25841;1327:181073">
              <FadeUp delay={0}>
              <div className="content-stretch flex flex-col font-semibold gap-[12px] items-start relative shrink-0 w-full" data-name="Heading and subheading" data-node-id="I2047:25841;1327:181074">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="I2047:25841;1327:181075">
                  Our Methodology
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/display-md,44px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/display-md,36px)] tracking-[-0.72px] w-full" data-node-id="I2047:25841;1327:181076">
                  How Proploy Works
                </p>
              </div>
              </FadeUp>
              <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-xl,30px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-xl,20px)] w-full" data-node-id="I2047:25841;1327:181077" style={{ fontVariationSettings: "'opsz' 14" }}>
                Unlock smarter software decisions, guaranteed. Three simple steps to smarter software selection and accelerated deployment.
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[96px] items-center max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="I2047:25841;1327:179891">
          <FadeUp delay={0}>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px min-w-px relative" data-name="Content" data-node-id="I2047:25841;1345:2026">
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-name="Icon and text" data-node-id="I2047:25841;1345:2027">
              <motion.div whileHover={{ rotate: 5, filter: 'brightness(0.95)' }} className="bg-[var(--colors\/background\/bg-brand-secondary,#d1e0ff)] overflow-clip relative rounded-full shrink-0 size-[48px]" data-name="Featured icon" data-node-id="I2047:25841;1345:2028">
                <div className="absolute left-[12px] overflow-clip size-[24px] top-[12px]" data-name="message-chat-circle" data-node-id="I2047:25841;1345:2028;3465:402858">
                  <div className="absolute inset-[8.33%_7.89%_8.33%_8.33%]" data-name="Icon" data-node-id="I2047:25841;1345:2028;3465:402858;3463:406231">
                    <div className="absolute inset-[-5%_-4.97%]">
                      <img alt="" className="block max-w-none size-full" src={imgIcon4} />
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Heading and supporting text" data-node-id="I2047:25841;1345:2029">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/display-sm,38px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/display-sm,30px)] w-full" data-node-id="I2047:25841;1345:2030">
                  Discover
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2031" style={{ fontVariationSettings: "'opsz' 14" }}>{`Proploy's AI analyses your unique business requirements and curates a marketplace of perfectly tailored software solutions.`}</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[20px] items-start pl-[16px] relative shrink-0 w-full" data-name="Check items" data-node-id="I2047:25841;1345:2032">
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Check item text" data-node-id="I2047:25841;1345:2033">
                <CheckIcon className="overflow-clip relative rounded-full shrink-0 size-[28px]" size="md" type="Line" />
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Text wrap" data-node-id="I2047:25841;1345:2033;3488:547153">
                  <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2033;3488:547154" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Define needs using natural language input
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Check item text" data-node-id="I2047:25841;1345:2034">
                <CheckIcon className="overflow-clip relative rounded-full shrink-0 size-[28px]" size="md" type="Line" />
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Text wrap" data-node-id="I2047:25841;1345:2034;3488:547153">
                  <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2034;3488:547154" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Validate choices with real-world performance data
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Check item text" data-node-id="I2047:25841;1345:2035">
                <CheckIcon className="overflow-clip relative rounded-full shrink-0 size-[28px]" size="md" type="Line" />
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Text wrap" data-node-id="I2047:25841;1345:2035;3488:547153">
                  <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2035;3488:547154" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Access objective, unbiased recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
          </FadeUp>
          <div className="flex-[1_0_0] h-[512px] min-h-px min-w-px relative" data-name="Content" data-node-id="I2047:25841;1327:179911">
            <div className="absolute bg-[var(--colors\/background\/bg-tertiary,#f5f5f5)] bottom-0 left-0 overflow-clip top-0 w-[768px]" data-name="Mockup wrap" data-node-id="I2047:25841;1327:179992">
              <div className="absolute border-4 border-[var(--component-colors\/components\/mockups\/screen-mockup-border,#181d27)] border-solid h-[512px] left-[48px] rounded-[10px] top-[48px] w-[768px]" data-name="Screen mockup 3:2" data-node-id="I2047:25841;1327:179912">
                <div className="absolute bg-black inset-[0_28px] shadow-[0px_32px_64px_-12px_var(--colors\/effects\/shadows\/shadow-3xl_01,rgba(10,13,18,0.14)),0px_5px_5px_-2.5px_var(--colors\/effects\/shadows\/shadow-3xl_02,rgba(10,13,18,0.04))]" data-name="Mockup shadow" data-node-id="I2047:25841;1327:179912;1296:876" />
                <div className="-translate-y-1/2 absolute aspect-[768/512] bg-white left-0 right-0 rounded-[10px] top-1/2" data-name="Screen mockup (REPLACE FILL)" data-node-id="I2047:25841;1327:179912;6132:222101" />
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[96px] items-center max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="I2047:25841;1327:179914">
          <div className="flex-[1_0_0] h-[512px] min-h-px min-w-px relative" data-name="Content" data-node-id="I2047:25841;1327:180026">
            <div className="absolute bg-[var(--colors\/background\/bg-tertiary,#f5f5f5)] bottom-0 overflow-clip right-0 top-0 w-[768px]" data-name="Mockup wrap" data-node-id="I2047:25841;1327:180027">
              <div className="absolute h-[640px] left-[208px] top-[112px] w-[313.991px]" data-name="iPhone mockup" data-node-id="I2047:25841;1869:457233">
                <div className="absolute bg-black inset-[0.12%_0.96%_0.35%_0.96%] rounded-[68px] shadow-[24.038px_24.038px_48.075px_-4px_rgba(10,13,18,0.2),12.019px_12.019px_24.038px_-2px_rgba(10,13,18,0.08)]" data-name="Mockup shadow" data-node-id="I2047:25841;1869:457233;6132:230002" />
                <div className="absolute bg-[var(--colors\/background\/bg-primary,white)] inset-[2.23%_5.26%_2.46%_5.02%] overflow-clip" data-name="Mockup wrap" data-node-id="I2047:25841;1869:457233;1869:445842">
                  <div className="absolute inset-[3.94%_0_-3.94%_0]" data-name="Screen mockup (REPLACE FILL)" data-node-id="I2047:25841;1869:457233;6132:225382">
                    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                      <img alt="" className="absolute max-w-none object-cover size-full" src={imgScreenMockupReplaceFill} />
                      <div className="absolute bg-white inset-0" />
                    </div>
                  </div>
                  <div className="absolute inset-[0_0_95.32%_0] overflow-clip" data-name="_iPhone mockup status bar" data-node-id="I2047:25841;1869:457233;1869:445846">
                    <div className="absolute inset-[45.61%_3.91%_24.56%_78.31%]" data-name="Right" data-node-id="I2047:25841;1869:457233;1869:445846;1868:670988">
                      <img alt="" className="absolute block max-w-none size-full" src={imgRight} />
                    </div>
                    <div className="absolute inset-[45.18%_83.5%_25.64%_8.92%]" data-name="Date" data-node-id="I2047:25841;1869:457233;1869:445846;1868:671002">
                      <img alt="" className="absolute block max-w-none size-full" src={imgDate} />
                    </div>
                  </div>
                  <div className="absolute h-[25.54px] left-0 top-[584.41px] w-[281.69px]" data-name="_iPhone mockup home" data-node-id="I2047:25841;1869:457233;1869:445847">
                    <div className="absolute bg-[var(--component-colors\/alpha\/alpha-black-100,black)] bottom-[6.01px] h-[3.756px] left-[32.27%] right-[32%] rounded-[100px]" data-name="Home" data-node-id="I2047:25841;1869:457233;1869:445847;1868:670967" />
                  </div>
                </div>
                <div className="absolute inset-[0_0_0.23%_0]" data-name="iPhone mockup" data-node-id="I2047:25841;1869:457233;1869:445848">
                  <div className="absolute inset-[15.85%_0.15%_60.14%_0]" data-name="Buttons" data-node-id="I2047:25841;1869:457233;1869:445849">
                    <img alt="" className="absolute block max-w-none size-full" src={imgButtons} />
                  </div>
                  <div className="absolute inset-[0_0.86%_0_0.71%]" data-name="Device surround" data-node-id="I2047:25841;1869:457233;1869:445854">
                    <img alt="" className="absolute block max-w-none size-full" src={imgDeviceSurround} />
                  </div>
                  <div className="absolute inset-[0.12%_1.09%_0.12%_0.94%]" data-name="Highlight band" data-node-id="I2047:25841;1869:457233;1869:445855">
                    <img alt="" className="absolute block max-w-none size-full" src={imgHighlightBand} />
                  </div>
                  <div className="absolute inset-[0.58%_2.04%_0.58%_1.89%]" data-name="Background" data-node-id="I2047:25841;1869:457233;1869:445856">
                    <img alt="" className="absolute block max-w-none size-full" src={imgBackground} />
                  </div>
                  <div className="absolute contents inset-[0_0.86%_0_0.71%]" data-name="Antenna bands" data-node-id="I2047:25841;1869:457233;1869:445857">
                    <div className="absolute bg-[#414141] inset-[0_20.45%_99.42%_78.13%]" data-name="Antenna" data-node-id="I2047:25841;1869:457233;1869:445858" />
                    <div className="absolute bg-[#414141] inset-[10.02%_0.86%_89.28%_97.96%]" data-name="Antenna" data-node-id="I2047:25841;1869:457233;1869:445859" />
                    <div className="absolute bg-[#414141] inset-[10.02%_98.11%_89.28%_0.71%]" data-name="Antenna" data-node-id="I2047:25841;1869:457233;1869:445860" />
                    <div className="absolute bg-[#414141] inset-[89.28%_98.11%_10.02%_0.71%]" data-name="Antenna" data-node-id="I2047:25841;1869:457233;1869:445861" />
                    <div className="absolute bg-[#414141] inset-[89.28%_0.86%_10.02%_97.96%]" data-name="Antenna" data-node-id="I2047:25841;1869:457233;1869:445862" />
                    <div className="absolute bg-[#414141] inset-[99.42%_78.28%_0_20.3%]" data-name="Antenna" data-node-id="I2047:25841;1869:457233;1869:445863" />
                  </div>
                  <div className="absolute inset-[2.8%_38.15%_95.34%_58.07%]" data-name="Camera" data-node-id="I2047:25841;1869:457233;1869:445864">
                    <img alt="" className="absolute block max-w-none size-full" src={imgCamera} />
                  </div>
                  <div className="absolute inset-[3.38%_44.29%_95.92%_44.14%]" data-name="Speaker" data-node-id="I2047:25841;1869:457233;1869:445868">
                    <img alt="" className="absolute block max-w-none size-full" src={imgSpeaker} />
                  </div>
                </div>
              </div>
              <div className="absolute h-[640px] right-[48.01px] top-[48px] w-[313.991px]" data-name="iPhone mockup" data-node-id="I2047:25841;1869:457234">
                <div className="absolute bg-black inset-[0.12%_0.96%_0.35%_0.96%] rounded-[68px] shadow-[24.038px_24.038px_48.075px_-4px_rgba(10,13,18,0.2),12.019px_12.019px_24.038px_-2px_rgba(10,13,18,0.08)]" data-name="Mockup shadow" data-node-id="I2047:25841;1869:457234;6132:230002" />
                <div className="absolute bg-[var(--colors\/background\/bg-primary,white)] inset-[2.23%_5.26%_2.46%_5.02%] overflow-clip" data-name="Mockup wrap" data-node-id="I2047:25841;1869:457234;1869:445842">
                  <div className="absolute inset-[3.94%_0_-3.94%_0]" data-name="Screen mockup (REPLACE FILL)" data-node-id="I2047:25841;1869:457234;6132:225382">
                    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                      <img alt="" className="absolute max-w-none object-cover size-full" src={imgScreenMockupReplaceFill} />
                      <div className="absolute bg-white inset-0" />
                    </div>
                  </div>
                  <div className="absolute inset-[0_0_95.32%_0] overflow-clip" data-name="_iPhone mockup status bar" data-node-id="I2047:25841;1869:457234;1869:445846">
                    <div className="absolute inset-[45.61%_3.91%_24.56%_78.31%]" data-name="Right" data-node-id="I2047:25841;1869:457234;1869:445846;1868:670988">
                      <img alt="" className="absolute block max-w-none size-full" src={imgRight1} />
                    </div>
                    <div className="absolute inset-[45.18%_83.5%_25.64%_8.92%]" data-name="Date" data-node-id="I2047:25841;1869:457234;1869:445846;1868:671002">
                      <img alt="" className="absolute block max-w-none size-full" src={imgDate} />
                    </div>
                  </div>
                  <div className="absolute h-[25.54px] left-0 top-[584.41px] w-[281.69px]" data-name="_iPhone mockup home" data-node-id="I2047:25841;1869:457234;1869:445847">
                    <div className="absolute bg-[var(--component-colors\/alpha\/alpha-black-100,black)] bottom-[6.01px] h-[3.756px] left-[32.27%] right-[32%] rounded-[100px]" data-name="Home" data-node-id="I2047:25841;1869:457234;1869:445847;1868:670967" />
                  </div>
                </div>
                <div className="absolute inset-[0_0_0.23%_0]" data-name="iPhone mockup" data-node-id="I2047:25841;1869:457234;1869:445848">
                  <div className="absolute inset-[15.85%_0.15%_60.14%_0]" data-name="Buttons" data-node-id="I2047:25841;1869:457234;1869:445849">
                    <img alt="" className="absolute block max-w-none size-full" src={imgButtons} />
                  </div>
                  <div className="absolute inset-[0_0.86%_0_0.71%]" data-name="Device surround" data-node-id="I2047:25841;1869:457234;1869:445854">
                    <img alt="" className="absolute block max-w-none size-full" src={imgDeviceSurround} />
                  </div>
                  <div className="absolute inset-[0.12%_1.09%_0.12%_0.94%]" data-name="Highlight band" data-node-id="I2047:25841;1869:457234;1869:445855">
                    <img alt="" className="absolute block max-w-none size-full" src={imgHighlightBand} />
                  </div>
                  <div className="absolute inset-[0.58%_2.04%_0.58%_1.89%]" data-name="Background" data-node-id="I2047:25841;1869:457234;1869:445856">
                    <img alt="" className="absolute block max-w-none size-full" src={imgBackground} />
                  </div>
                  <div className="absolute contents inset-[0_0.86%_0_0.71%]" data-name="Antenna bands" data-node-id="I2047:25841;1869:457234;1869:445857">
                    <div className="absolute bg-[#414141] inset-[0_20.45%_99.42%_78.13%]" data-name="Antenna" data-node-id="I2047:25841;1869:457234;1869:445858" />
                    <div className="absolute bg-[#414141] inset-[10.02%_0.86%_89.28%_97.96%]" data-name="Antenna" data-node-id="I2047:25841;1869:457234;1869:445859" />
                    <div className="absolute bg-[#414141] inset-[10.02%_98.11%_89.28%_0.71%]" data-name="Antenna" data-node-id="I2047:25841;1869:457234;1869:445860" />
                    <div className="absolute bg-[#414141] inset-[89.28%_98.11%_10.02%_0.71%]" data-name="Antenna" data-node-id="I2047:25841;1869:457234;1869:445861" />
                    <div className="absolute bg-[#414141] inset-[89.28%_0.86%_10.02%_97.96%]" data-name="Antenna" data-node-id="I2047:25841;1869:457234;1869:445862" />
                    <div className="absolute bg-[#414141] inset-[99.42%_78.28%_0_20.3%]" data-name="Antenna" data-node-id="I2047:25841;1869:457234;1869:445863" />
                  </div>
                  <div className="absolute inset-[2.8%_38.15%_95.34%_58.07%]" data-name="Camera" data-node-id="I2047:25841;1869:457234;1869:445864">
                    <img alt="" className="absolute block max-w-none size-full" src={imgCamera} />
                  </div>
                  <div className="absolute inset-[3.38%_44.29%_95.92%_44.14%]" data-name="Speaker" data-node-id="I2047:25841;1869:457234;1869:445868">
                    <img alt="" className="absolute block max-w-none size-full" src={imgSpeaker} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px min-w-px relative" data-name="Content" data-node-id="I2047:25841;1345:2050">
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-name="Icon and text" data-node-id="I2047:25841;1345:2051">
              <div className="bg-[var(--colors\/background\/bg-brand-secondary,#d1e0ff)] overflow-clip relative rounded-full shrink-0 size-[48px]" data-name="Featured icon" data-node-id="I2047:25841;1345:2052">
                <div className="absolute left-[12px] overflow-clip size-[24px] top-[12px]" data-name="zap-fast" data-node-id="I2047:25841;1345:2052;3465:402858">
                  <div className="absolute inset-[12.5%_8.22%_12.5%_8.33%]" data-name="Icon" data-node-id="I2047:25841;1345:2052;3465:402858;3463:405181">
                    <div className="absolute inset-[-5.56%_-4.99%]">
                      <img alt="" className="block max-w-none size-full" src={imgIcon5} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Heading and supporting text" data-node-id="I2047:25841;1345:2053">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/display-sm,38px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/display-sm,30px)] w-full" data-node-id="I2047:25841;1345:2054">
                  Decide
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2055" style={{ fontVariationSettings: "'opsz' 14" }}>{`Simplify your procurement process with pre-negotiated enterprise pricing, 100% transparency, and strategic vendor partnerships. `}</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[20px] items-start pl-[16px] relative shrink-0 w-full" data-name="Check items" data-node-id="I2047:25841;1345:2056">
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Check item text" data-node-id="I2047:25841;1345:2057">
                <CheckIcon className="overflow-clip relative rounded-full shrink-0 size-[28px]" size="md" type="Line" />
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Text wrap" data-node-id="I2047:25841;1345:2057;3488:547153">
                  <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2057;3488:547154" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Benefit from pre-negotiated enterprise pricing
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Check item text" data-node-id="I2047:25841;1345:2058">
                <CheckIcon className="overflow-clip relative rounded-full shrink-0 size-[28px]" size="md" type="Line" />
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Text wrap" data-node-id="I2047:25841;1345:2058;3488:547153">
                  <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2058;3488:547154" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Achieve full clarity with transparent, itemized costs
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Check item text" data-node-id="I2047:25841;1345:2059">
                <CheckIcon className="overflow-clip relative rounded-full shrink-0 size-[28px]" size="md" type="Line" />
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Text wrap" data-node-id="I2047:25841;1345:2059;3488:547153">
                  <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2059;3488:547154" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Leverage exclusive strategic vendor partnerships
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FadeUp delay={0.15}>
        <div className="content-stretch flex gap-[96px] items-center max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="I2047:25841;1327:179937">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px min-w-px relative" data-name="Content" data-node-id="I2047:25841;1345:2098">
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-name="Icon and text" data-node-id="I2047:25841;1345:2099">
              <motion.div whileHover={{ rotate: 5, filter: 'brightness(0.95)' }} className="bg-[var(--colors\/background\/bg-brand-secondary,#d1e0ff)] overflow-clip relative rounded-full shrink-0 size-[48px]" data-name="Featured icon" data-node-id="I2047:25841;1345:2100">
                <div className="absolute left-[12px] overflow-clip size-[24px] top-[12px]" data-name="chart-breakout-square" data-node-id="I2047:25841;1345:2100;3465:402858">
                  <div className="absolute inset-[8.33%_8.29%_12.5%_12.5%]" data-name="Icon" data-node-id="I2047:25841;1345:2100;3465:402858;3463:403924">
                    <div className="absolute inset-[-5.26%]">
                      <img alt="" className="block max-w-none size-full" src={imgIcon6} />
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Heading and supporting text" data-node-id="I2047:25841;1345:2101">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/display-sm,38px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/display-sm,30px)] w-full" data-node-id="I2047:25841;1345:2102">
                  Deploy
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2103" style={{ fontVariationSettings: "'opsz' 14" }}>
                  Instantly match with vetted specialists and gain dedicated project management to ensure seamless execution and guaranteed success.
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[20px] items-start pl-[16px] relative shrink-0 w-full" data-name="Check items" data-node-id="I2047:25841;1345:2104">
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Check item text" data-node-id="I2047:25841;1345:2105">
                <CheckIcon className="overflow-clip relative rounded-full shrink-0 size-[28px]" size="md" type="Line" />
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Text wrap" data-node-id="I2047:25841;1345:2105;3488:547153">
                  <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2105;3488:547154" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Filter, export, and drilldown on the data quickly
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Check item text" data-node-id="I2047:25841;1345:2106">
                <CheckIcon className="overflow-clip relative rounded-full shrink-0 size-[28px]" size="md" type="Line" />
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Text wrap" data-node-id="I2047:25841;1345:2106;3488:547153">
                  <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2106;3488:547154" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Save, schedule, and automate reports to your inbox
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Check item text" data-node-id="I2047:25841;1345:2107">
                <CheckIcon className="overflow-clip relative rounded-full shrink-0 size-[28px]" size="md" type="Line" />
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Text wrap" data-node-id="I2047:25841;1345:2107;3488:547153">
                  <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-lg,28px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-lg,18px)] w-full" data-node-id="I2047:25841;1345:2107;3488:547154" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Connect the tools you already use with 100+ integrations
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-[1_0_0] h-[512px] min-h-px min-w-px relative" data-name="Content" data-node-id="I2047:25841;1327:180146">
            <div className="absolute bg-[var(--colors\/background\/bg-tertiary,#f5f5f5)] bottom-0 left-0 overflow-clip top-0 w-[768px]" data-name="Mockup wrap" data-node-id="I2047:25841;1327:180147">
              <div className="absolute border-4 border-[var(--component-colors\/components\/mockups\/screen-mockup-border,#181d27)] border-solid h-[512px] left-[200px] rounded-[10px] top-[48px] w-[768px]" data-name="Screen mockup 3:2" data-node-id="I2047:25841;1327:180148">
                <div className="absolute bg-black inset-[0_28px] shadow-[0px_32px_64px_-12px_var(--colors\/effects\/shadows\/shadow-3xl_01,rgba(10,13,18,0.14)),0px_5px_5px_-2.5px_var(--colors\/effects\/shadows\/shadow-3xl_02,rgba(10,13,18,0.04))]" data-name="Mockup shadow" data-node-id="I2047:25841;1327:180148;1296:876" />
                <div className="-translate-y-1/2 absolute aspect-[768/512] left-0 right-0 rounded-[10px] top-1/2" data-name="Screen mockup (REPLACE FILL)" data-node-id="I2047:25841;1327:180148;6132:222101">
                  <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[10px]">
                    <img alt="" className="absolute max-w-none object-cover rounded-[10px] size-full" src={imgScreenMockupReplaceFill1} />
                    <div className="absolute bg-white inset-0 rounded-[10px]" />
                  </div>
                </div>
              </div>
              <div className="absolute h-[640px] right-[406.01px] top-[112px] w-[313.991px]" data-name="iPhone mockup" data-node-id="I2047:25841;1869:457365">
                <div className="absolute bg-black inset-[0.12%_0.96%_0.35%_0.96%] rounded-[68px] shadow-[24.038px_24.038px_48.075px_-4px_rgba(10,13,18,0.2),12.019px_12.019px_24.038px_-2px_rgba(10,13,18,0.08)]" data-name="Mockup shadow" data-node-id="I2047:25841;1869:457365;6132:230002" />
                <div className="absolute bg-[var(--colors\/background\/bg-primary,white)] inset-[2.23%_5.26%_2.46%_5.02%] overflow-clip" data-name="Mockup wrap" data-node-id="I2047:25841;1869:457365;1869:445842">
                  <div className="absolute inset-[3.94%_0_-3.94%_0]" data-name="Screen mockup (REPLACE FILL)" data-node-id="I2047:25841;1869:457365;6132:225382">
                    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                      <img alt="" className="absolute max-w-none object-cover size-full" src={imgScreenMockupReplaceFill} />
                      <div className="absolute bg-white inset-0" />
                    </div>
                  </div>
                  <div className="absolute inset-[0_0_95.32%_0] overflow-clip" data-name="_iPhone mockup status bar" data-node-id="I2047:25841;1869:457365;1869:445846">
                    <div className="absolute inset-[45.61%_3.91%_24.56%_78.31%]" data-name="Right" data-node-id="I2047:25841;1869:457365;1869:445846;1868:670988">
                      <img alt="" className="absolute block max-w-none size-full" src={imgRight1} />
                    </div>
                    <div className="absolute inset-[45.18%_83.5%_25.64%_8.92%]" data-name="Date" data-node-id="I2047:25841;1869:457365;1869:445846;1868:671002">
                      <img alt="" className="absolute block max-w-none size-full" src={imgDate} />
                    </div>
                  </div>
                  <div className="absolute h-[25.54px] left-0 top-[584.41px] w-[281.69px]" data-name="_iPhone mockup home" data-node-id="I2047:25841;1869:457365;1869:445847">
                    <div className="absolute bg-[var(--component-colors\/alpha\/alpha-black-100,black)] bottom-[6.01px] h-[3.756px] left-[32.27%] right-[32%] rounded-[100px]" data-name="Home" data-node-id="I2047:25841;1869:457365;1869:445847;1868:670967" />
                  </div>
                </div>
                <div className="absolute inset-[0_0_0.23%_0]" data-name="iPhone mockup" data-node-id="I2047:25841;1869:457365;1869:445848">
                  <div className="absolute inset-[15.85%_0.15%_60.14%_0]" data-name="Buttons" data-node-id="I2047:25841;1869:457365;1869:445849">
                    <img alt="" className="absolute block max-w-none size-full" src={imgButtons} />
                  </div>
                  <div className="absolute inset-[0_0.86%_0_0.71%]" data-name="Device surround" data-node-id="I2047:25841;1869:457365;1869:445854">
                    <img alt="" className="absolute block max-w-none size-full" src={imgDeviceSurround} />
                  </div>
                  <div className="absolute inset-[0.12%_1.09%_0.12%_0.94%]" data-name="Highlight band" data-node-id="I2047:25841;1869:457365;1869:445855">
                    <img alt="" className="absolute block max-w-none size-full" src={imgHighlightBand} />
                  </div>
                  <div className="absolute inset-[0.58%_2.04%_0.58%_1.89%]" data-name="Background" data-node-id="I2047:25841;1869:457365;1869:445856">
                    <img alt="" className="absolute block max-w-none size-full" src={imgBackground} />
                  </div>
                  <div className="absolute contents inset-[0_0.86%_0_0.71%]" data-name="Antenna bands" data-node-id="I2047:25841;1869:457365;1869:445857">
                    <div className="absolute bg-[#414141] inset-[0_20.45%_99.42%_78.13%]" data-name="Antenna" data-node-id="I2047:25841;1869:457365;1869:445858" />
                    <div className="absolute bg-[#414141] inset-[10.02%_0.86%_89.28%_97.96%]" data-name="Antenna" data-node-id="I2047:25841;1869:457365;1869:445859" />
                    <div className="absolute bg-[#414141] inset-[10.02%_98.11%_89.28%_0.71%]" data-name="Antenna" data-node-id="I2047:25841;1869:457365;1869:445860" />
                    <div className="absolute bg-[#414141] inset-[89.28%_98.11%_10.02%_0.71%]" data-name="Antenna" data-node-id="I2047:25841;1869:457365;1869:445861" />
                    <div className="absolute bg-[#414141] inset-[89.28%_0.86%_10.02%_97.96%]" data-name="Antenna" data-node-id="I2047:25841;1869:457365;1869:445862" />
                    <div className="absolute bg-[#414141] inset-[99.42%_78.28%_0_20.3%]" data-name="Antenna" data-node-id="I2047:25841;1869:457365;1869:445863" />
                  </div>
                  <div className="absolute inset-[2.8%_38.15%_95.34%_58.07%]" data-name="Camera" data-node-id="I2047:25841;1869:457365;1869:445864">
                    <img alt="" className="absolute block max-w-none size-full" src={imgCamera} />
                  </div>
                  <div className="absolute inset-[3.38%_44.29%_95.92%_44.14%]" data-name="Speaker" data-node-id="I2047:25841;1869:457365;1869:445868">
                    <img alt="" className="absolute block max-w-none size-full" src={imgSpeaker} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </FadeUp>
      </div>
      <div className="bg-[var(--colors\/background\/bg-secondary,#fafafa)] content-stretch flex flex-col gap-[64px] items-center overflow-clip py-[96px] relative shrink-0 w-full" data-name="Features section" data-node-id="2047:26288">
        <div className="content-stretch flex flex-col gap-0 items-start max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="I2047:26288;1334:2553">
          <div className="content-stretch flex flex-col gap-0 items-center relative shrink-0 w-full" data-name="Content" data-node-id="I2047:26288;1334:2554">
            <div className="content-stretch flex flex-col gap-[20px] items-center max-w-[768px] relative shrink-0 text-center w-full" data-name="Heading and supporting text" data-node-id="I2047:26288;1334:2555">
              <div className="content-stretch flex flex-col font-semibold gap-[12px] items-start relative shrink-0 w-full" data-name="Heading and subheading" data-node-id="I2047:26288;1334:2556">
                <p className="font-[family-name:var(--font-dm-sans)] leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-brand-secondary-\(700\),#004eeb)] text-[length:var(--font-size\/text-md,16px)] w-full" data-node-id="I2047:26288;1334:2557">
                  Our Services
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] leading-[var(--line-height\/display-md,44px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary-\(900\),#181d27)] text-[length:var(--font-size\/display-md,36px)] tracking-[-0.72px] w-full" data-node-id="I2047:26288;1334:2558">
                  Get more value from your tools.
                </p>
              </div>
              <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-xl,30px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-xl,20px)] w-full" data-node-id="I2047:26288;1334:2559" style={{ fontVariationSettings: "'opsz' 14" }}>
                Connect your tools, connect your teams. With over 30+ apps and micro-services already available in our directory, your team’s favourite tools are just a click away.
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-0 items-center max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="I2047:26288;1334:2560">
          <div className="content-start flex flex-wrap gap-[32px] items-start justify-center max-w-[1024px] relative shrink-0 w-full" data-name="Content" data-node-id="I2047:26288;1334:2562">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:180301"
            >
              <Notion className="overflow-clip relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.04 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:180608"
            >
              <Slack className="relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.08 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:180918"
            >
              <GoogleDrive className="overflow-clip relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.12 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:181231"
            >
              <Intercom className="overflow-clip relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.16 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:181547"
            >
              <Jira className="overflow-clip relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:181866"
            >
              <Dropbox className="relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.24 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:182188"
            >
              <Stripe className="relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.28 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:182513"
            >
              <Zapier className="overflow-clip relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.32 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:182841"
            >
              <Figma className="overflow-clip relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.36 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:183172"
            >
              <Confluence className="overflow-clip relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:183506"
            >
              <Mailchimp className="overflow-clip relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.44 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:183843"
            >
              <Zendesk className="overflow-clip relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.48 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:184183"
            >
              <GCalendar className="relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.52 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:184526"
            >
              <Whatsapp className="relative shrink-0 size-[80px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.56 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:184872"
            >
              <div className="relative shrink-0 size-[80px]" data-name="discord" data-node-id="I2047:26288;1334:2840">
                <div className="absolute inset-[6.25%]" data-name="bg" data-node-id="I2047:26288;1334:2840;1334:786">
                  <img alt="" className="absolute block max-w-none size-full" src={imgBg6} />
                </div>
                <div className="absolute bottom-1/4 left-[15.63%] right-[15.63%] top-1/4" data-name="vector" data-node-id="I2047:26288;1334:2840;1334:787">
                  <img alt="" className="absolute block max-w-none size-full" src={imgVector11} />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: 'brightness(0.95)', borderColor: "#155eef" }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-[var(--colors\/base\/white,white)] border border-[var(--colors\/border\/border-primary,#d5d7da)] border-solid content-stretch flex gap-0 items-start justify-center p-[4px] relative rounded-[12px] shadow-[0px_1px_2px_0px_var(--colors\/effects\/shadows\/shadow-xs,rgba(10,13,18,0.05))] shrink-0"
              data-name="Icon wrap"
              data-node-id="I2047:26288;6132:185221"
            >
              <Bitbucket className="overflow-clip relative shrink-0 size-[80px]" />
            </motion.div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-0 items-center max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="I2047:26288;1342:1596">
          <div className="content-stretch flex flex-col gap-0 items-center relative shrink-0 w-full" data-name="Content" data-node-id="I2047:26288;1342:1597">
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Actions" data-node-id="I2047:26288;1342:1713">
              <motion.div whileHover={{ filter: 'brightness(0.95)' }} whileTap={{ filter: 'brightness(0.9)' }} transition={{ duration: 0.2 }} className="bg-[#155eef] border-2 border-[rgba(255,255,255,0.12)] border-solid content-stretch flex gap-[6px] items-center justify-center overflow-clip px-[18px] py-[12px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] shrink-0 cursor-pointer" data-name="Buttons/Button" data-node-id="I2047:26288;3293:437817">
                <div className="content-stretch flex items-center justify-center px-[2px] relative shrink-0" data-name="Text padding" data-node-id="I2047:26288;3293:437817;6421:283565">
                  <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[24px] relative shrink-0 text-white text-[16px] whitespace-nowrap" data-node-id="I2047:26288;3293:437817;3287:432937">
                    All integrations
                  </p>
                </div>
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--colors\/background\/bg-brand-section,#0040c1)] content-stretch flex flex-col gap-0 items-center overflow-clip py-[96px] relative shrink-0 w-full" data-name="Newsletter CTA section" data-node-id="2047:26895">
        <div className="content-stretch flex flex-col gap-0 items-start max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="I2047:26895;1365:208689">
          <div className="content-start flex flex-wrap gap-[32px] items-start relative shrink-0 w-full" data-name="Content" data-node-id="I2047:26895;1365:208690">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start max-w-[768px] min-h-px min-w-[480px] relative" data-name="Heading and supporting text" data-node-id="I2047:26895;1365:208691">
              <FadeUp delay={0}>
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/display-md,44px)] relative shrink-0 text-[color:var(--colors\/text\/text-primary_on-brand,white)] text-[length:var(--font-size\/display-md,36px)] tracking-[-0.72px] w-full" data-node-id="I2047:26895;1365:208692">
                  Transform Your Software Procurement Strategy
                </p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-xl,30px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary_on-brand,#b2ccff)] text-[length:var(--font-size\/text-xl,20px)] w-full" data-node-id="I2047:26895;1365:208693" style={{ fontVariationSettings: "'opsz' 14" }}>
                  Join leading enterprises that have modernised their procurement operations and achieved consistent, high-success implementation outcomes.
                </p>
              </FadeUp>
            </div>
            <FadeUp delay={0.2}>
              <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-[480px]" data-name="Email capture" data-node-id="I2047:26895;3288:455916">
                <div className="flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative">
                  <InputField placeholder="Enter your email" />
                  <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[20px] relative shrink-0 text-[#b2ccff] text-[14px] text-left w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
                    <span>{`We care about your data in our `}</span>
                    <span className="[text-decoration-skip-ink:none] decoration-solid underline">
                      privacy policy
                    </span>
                    <span>.</span>
                  </p>
                </div>
                <motion.div whileHover={{ filter: 'brightness(0.95)' }} whileTap={{ filter: 'brightness(0.9)' }} transition={{ duration: 0.2 }} className="bg-[#155eef] border-2 border-[rgba(255,255,255,0.12)] border-solid content-stretch flex gap-[6px] items-center justify-center overflow-clip px-[18px] py-[12px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] shrink-0 cursor-pointer" data-name="Buttons/Button" data-node-id="I2047:26895;3288:455918">
                  <div className="content-stretch flex items-center justify-center px-[2px] relative shrink-0" data-name="Text padding" data-node-id="I2047:26895;3288:455918;6421:283565">
                    <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[24px] relative shrink-0 text-white text-[16px] whitespace-nowrap" data-node-id="I2047:26895;3288:455918;3287:432937">
                      Subscribe
                    </p>
                  </div>
                  <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
                </motion.div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[64px] items-center pb-[48px] pt-[64px] relative shrink-0 w-full" data-name="Section" data-node-id="2047:27082">
        <div className="content-stretch flex flex-col gap-0 items-start max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="2047:27083">
          <div className="content-start flex flex-wrap gap-[48px_64px] items-start relative shrink-0 w-full" data-name="Content" data-node-id="2047:27084">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start max-w-[320px] min-h-px min-w-[320px] relative" data-name="Logo and supporting text" data-node-id="2047:27085">
              <Logo className="content-stretch flex items-start relative shrink-0 w-[139px]" />
              <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] min-w-full relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] w-[min-content]" data-node-id="2047:27087" style={{ fontVariationSettings: "'opsz' 14" }}>
                Discover, compare, and connect with the best software solutions for your business.
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] gap-[32px] items-start min-h-px min-w-[800px] relative" data-name="Links" data-node-id="2047:27089">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-[96px] relative" data-name="_Footer links column" data-node-id="2047:27090">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-quaternary-\(500\),#717680)] text-[length:var(--font-size\/text-sm,14px)] w-full" data-node-id="I2047:27090;3288:570971">
                  Product
                </p>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Footer links" data-node-id="I2047:27090;3288:570972">
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27090;3288:570973">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27090;3288:570973;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27090;3288:570973;3288:570930;3287:433397">
                        Explore by Category
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27090;3288:570974">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27090;3288:570974;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27090;3288:570974;3288:570930;3287:433397">
                        Explore by Industry
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27090;3288:570975">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27090;3288:570975;3288:570946">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27090;3288:570975;3288:570946;3287:433397">
                        Explore Vetted Experts
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27090;3288:570976">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27090;3288:570976;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27090;3288:570976;3288:570930;3287:433397">
                        Create a Listing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-[96px] relative" data-name="_Footer links column" data-node-id="2047:27091">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-quaternary-\(500\),#717680)] text-[length:var(--font-size\/text-sm,14px)] w-full" data-node-id="I2047:27091;3288:570971">
                  Company
                </p>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Footer links" data-node-id="I2047:27091;3288:570972">
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27091;3288:570973">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27091;3288:570973;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27091;3288:570973;3288:570930;3287:433397">
                        About
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27091;3288:570974">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27091;3288:570974;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27091;3288:570974;3288:570930;3287:433397">
                        Blog
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27091;3288:570975">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27091;3288:570975;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27091;3288:570975;3288:570930;3287:433397">
                        Become an Expert
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27091;3288:570976">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27091;3288:570976;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27091;3288:570976;3288:570930;3287:433397">
                        FAQs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-[96px] relative" data-name="_Footer links column" data-node-id="2047:27094">
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-sm,20px)] relative shrink-0 text-[color:var(--colors\/text\/text-quaternary-\(500\),#717680)] text-[length:var(--font-size\/text-sm,14px)] w-full" data-node-id="I2047:27094;3288:570971">
                  Legal
                </p>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Footer links" data-node-id="I2047:27094;3288:570972">
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27094;3288:570973">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27094;3288:570973;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27094;3288:570973;3288:570930;3287:433397">
                        Terms
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27094;3288:570974">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27094;3288:570974;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27094;3288:570974;3288:570930;3287:433397">
                        Privacy
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27094;3288:570975">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27094;3288:570975;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27094;3288:570975;3288:570930;3287:433397">
                        Cookies
                      </p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-0 items-center relative shrink-0" data-name="_Footer link" data-node-id="I2047:27094;3288:570976">
                    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button" data-node-id="I2047:27094;3288:570976;3288:570930">
                      <p className="font-[family-name:var(--font-dm-sans)] font-semibold leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-tertiary-\(600\),#535862)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="I2047:27094;3288:570976;3288:570930;3287:433397">
                        Licenses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-0 items-start max-w-[1280px] px-[32px] relative shrink-0 w-full" data-name="Container" data-node-id="2047:27095">
          <div className="border-[var(--colors\/border\/border-secondary,#e9eaeb)] border-solid border-t content-center flex flex-wrap gap-0 gap-y-[24px] items-center justify-between pt-[32px] relative shrink-0 w-full" data-name="Content" data-node-id="2047:27096">
            <p className="font-[family-name:var(--font-dm-sans)] font-normal leading-[var(--line-height\/text-md,24px)] relative shrink-0 text-[color:var(--colors\/text\/text-quaternary-\(500\),#717680)] text-[length:var(--font-size\/text-md,16px)] whitespace-nowrap" data-node-id="2047:27097" style={{ fontVariationSettings: "'opsz' 14" }}>
              © 2026 Proploy. All rights reserved.
            </p>
            <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Social icons" data-node-id="2047:27098">
              <motion.div whileHover={{ filter: 'brightness(0.7)', y: -2 }} className="overflow-clip relative shrink-0 size-[24px]" data-name="Social icon" data-node-id="2047:27099">
                <div className="-translate-x-1/2 absolute aspect-[22.981643676757812/22] bottom-[6.25%] left-1/2 top-[6.25%]" data-name="Vector" data-node-id="I2047:27099;6163:434073">
                  <img alt="" className="absolute block max-w-none size-full" src={imgVector12} />
                </div>
              </motion.div>
              <motion.div whileHover={{ filter: 'brightness(0.7)', y: -2 }} className="overflow-clip relative shrink-0 size-[24px]" data-name="Social icon" data-node-id="2047:27100">
                <img alt="" className="absolute block max-w-none size-full" src={imgSocialIcon} />
              </motion.div>
              <motion.div whileHover={{ filter: 'brightness(0.7)', y: -2 }} className="overflow-clip relative shrink-0 size-[24px]" data-name="Social icon" data-node-id="2047:27101">
                <div className="absolute inset-[0_0_0.61%_0]" data-name="Vector" data-node-id="I2047:27101;1422:1090">
                  <img alt="" className="absolute block max-w-none size-full" src={imgVector13} />
                </div>
              </motion.div>
              <motion.div whileHover={{ filter: 'brightness(0.7)', y: -2 }} className="overflow-clip relative shrink-0 size-[24px]" data-name="Social icon" data-node-id="2047:27102">
                <div className="absolute inset-[0_0_2.31%_0]" data-name="Vector" data-node-id="I2047:27102;1507:257963">
                  <img alt="" className="absolute block max-w-none size-full" src={imgVector14} />
                </div>
              </motion.div>
              <motion.div whileHover={{ filter: 'brightness(0.7)', y: -2 }} className="overflow-clip relative shrink-0 size-[24px]" data-name="Social icon" data-node-id="2047:27103">
                <div className="absolute inset-[0_15.23%_0_15.25%]" data-name="Vector" data-node-id="I2047:27103;1507:257988">
                  <img alt="" className="absolute block max-w-none size-full" src={imgVector15} />
                </div>
              </motion.div>
              <motion.div whileHover={{ filter: 'brightness(0.7)', y: -2 }} className="relative shrink-0 size-[24px]" data-name="Social icon" data-node-id="2047:27104">
                <img alt="" className="absolute block max-w-none size-full" src={imgSocialIcon1} />
              </motion.div>
              <motion.div whileHover={{ filter: 'brightness(0.7)', y: -2 }} className="overflow-clip relative shrink-0 size-[24px]" data-name="Social icon" data-node-id="2047:27105">
                <div className="absolute inset-[0_35.92%_29.01%_1.52%]" data-name="Vector" data-node-id="I2047:27105;7441:76607">
                  <img alt="" className="absolute block max-w-none size-full" src={imgVector16} />
                </div>
                <div className="absolute inset-[14.51%_18.72%_14.5%_18.72%]" data-name="Vector" data-node-id="I2047:27105;7441:76608">
                  <img alt="" className="absolute block max-w-none size-full" src={imgVector17} />
                </div>
                <div className="absolute inset-[29.01%_1.51%_0_35.92%]" data-name="Vector" data-node-id="I2047:27105;7441:76609">
                  <img alt="" className="absolute block max-w-none size-full" src={imgVector18} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
